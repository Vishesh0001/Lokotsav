const db = require("../../../../config/database");
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code")
const bcrypt = require("bcrypt");
const sendEmail = require("../../../../utilities/sendEmail")

 class UserModel{
async signup(request_data){ 
    try{
        // ("signup entered")
        // ("data",request_data);
        
        const checkUniqueEmail = await common.checkEmail(request_data.email)
        if(!checkUniqueEmail){
        
            const hashedPassword = await bcrypt.hash(request_data.password, 10);
            const userData = {
                username : request_data.username,
                
                email:request_data.email,
                password: hashedPassword
            }
            const insertQuery = `insert into tbl_user set ?`
            const [queryResponse] = await db.query(insertQuery,[userData])
            // (insertQuery)
            // (queryResponse)
            if(queryResponse.affectedRows==0){
                return({
                    code: responsecode.OPERATION_FAILED,
                    message: {keyword: "user_creation_failed"},
                    data: null,
                    status: 400
                })
            }else{
                const userId = queryResponse.insertId
                const otp = common.generateOTP()
                const otpData={
                    user_id: userId,
                    otp: otp
                }
                //**********send maill */
                const insertQuery = `insert into tbl_otp set?`;
                const [otpres] = await db.query(insertQuery,[otpData])
                if(otpres.affectedRows >= 1){
  const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #333;">Hello ${request_data.username},</h2>
      <p>Thanks for signing up on <strong>Lokotsav</strong>!</p>
      <p>Your One-Time Password (OTP) for account verification is:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 16px 0; color: #2d8cf0;">${otp}</div>
      <p>This OTP is valid for the next 10 minutes.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">If you didn’t request this, please ignore this email.</p>
    </div>
  `;

  await sendEmail(request_data.email, "Verify Your Lokotsav Account", emailBody,'verify-otp');

                     return({
                      code: responsecode.SUCCESS,
                      message: {keyword: "signup_successful"},
                      data: queryResponse.insertId,
                      status: 201
                })}
            }
        }else{
            return ({
                code: responsecode.OPERATION_FAILED,
                message: {keyword: "email_already_registered"},
                data: null,
                status: 409
            })
        }
    }catch(error){
        // (error)
        return({
            code: responsecode.SERVER_ERROR,
            message: {keyword: "internal_server_error"},
            data: null,
            status: 500
        })
    }
}
async verifyOTP(request_data) {
    try {
        // (request_data);
        
        const otp = request_data.otp;

        const userQuery = "SELECT user_id FROM tbl_otp WHERE otp = ? AND is_active = 1    AND created_at >= NOW() - INTERVAL 10 MINUTE ORDER BY created_at DESC LIMIT 1";
        const [userResult] = await db.query(userQuery, [otp]);

        if (userResult.length == 0) {
            return {
                code: responsecode.OTP_NOT_VERIFIED,
                message: { keyword: "invalid otp" },
                data: null,
                status: 400
            };
        } else {
            const user_id = userResult[0].user_id;
            const checkuser = 'select is_verified,created_at from tbl_user where is_active=1 and is_deleted = 0 and id= ? '
            const [userresult] = await db.query(checkuser, [user_id])
            if (userresult[0].is_verified == 1) {
                return ({
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: "already_verified" },
                    data: null,
                    status: 400
                })
            } else {
          
                // Update user as verified
                const updateUserQuery = "UPDATE tbl_user SET is_verified = 1 WHERE id = ?";
                await db.query(updateUserQuery, [user_id]);
                // Deactivate OTP
                const deactivateOtpQuery = "UPDATE tbl_otp SET is_active = 0 WHERE user_id = ?";
                await db.query(deactivateOtpQuery, [user_id]);
                let role = 'user'
                let generatedToken = common.generateToken(user_id, role)
                let tokenresponse = await common.storeToken(user_id, generatedToken)
                if (tokenresponse) {
                    return({
                        code: responsecode.SUCCESS,
                        message: { keyword: "otp_verified_successfully" },
                        data: {
                            user_id,
                            token: generatedToken
                        },
                        status: 200
                    })
                } else {
                    return({
                        code: responsecode.SERVER_ERROR,
                        message: { keyword: "token_storage_failed" },
                        data: null,
                        status: 500
                    })
                }
            }
        }
    } catch (error) {
        console.error("Error in verifyOTP:", error);
        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        };
    }
}
async resendOTP(user_id){
try {
    // ('uuuuuuis',user_id);
    let id = user_id.id
   let deactivateOtpQuery =`update tbl_otp set is_active = 0, is_delete=1 where user_id = ? and is_active =1 and is_delete=0`
   let [res] = await db.query(deactivateOtpQuery,[id])
   if(res.affectedRows!=0){
    let selectquery =`select email from tbl_user where id=?`
    let [request_data] = await db.query(selectquery,[id])
    if(!request_data){
        return({
            code:2,
            message:{keyword:'user not found'},
            data:[],
            status:400
        })
    }
     const otp = common.generateOTP()
                const otpData={
                    user_id: id,
                    otp: otp
                }
                
                const insertQuery = `insert into tbl_otp set?`;
                const [otpres] = await db.query(insertQuery,[otpData])
                if(otpres.affectedRows >= 1){
  const emailBody = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
      <h2 style="color: #333;">Hello user,</h2>
      <p>Thanks for signing up on <strong>Lokotsav</strong>!</p>
      <p>Your RESENT One-Time Password (OTP) for account verification is:</p>
      <div style="font-size: 24px; font-weight: bold; margin: 16px 0; color: #2d8cf0;">${otp}</div>
      <p>This OTP is valid for the next 10 minutes.</p>
      <hr />
      <p style="font-size: 12px; color: #999;">If you didn’t request this, please ignore this email.</p>
    </div>
  `;
try {
     await sendEmail(request_data[0].email, "Verify Your Lokotsav Account", emailBody,'resend-otp');
} catch (error) {
    return({
        code:responsecode.OPERATION_FAILED,
        message:{keyword:error.message},
        data:[],
        status:500
    })
}
 

                     return({
                      code: responsecode.SUCCESS,
                      message: {keyword: "OTP Resent Succesfully to your mail!"},
                      data: [],
                      status: 200
                })}
                else{
                  
                    return({
                        code:responsecode.OPERATION_FAILED,
                        message:{keyword:'Failed to send email, please try again later.'},
                        data:[],
status:400
                    })
                }
   }else{
    
    return({
        code:responsecode.OPERATION_FAILED,
        message:{keyword:'You need to Sign-up or login'},
        data:[],
        status:400
    })
   }
} catch (error) {
    // (error);
    
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
}
}
async login(request_data){
    try {
        let email = request_data.email

        let selectQuery = `select id,role,email,password,is_active,is_deleted,is_verified from tbl_user where email = ? order by id desc limit 1`
        // ("query",selectQuery);
        
        const [response] = await db.query(selectQuery, email)
        // ("res",response);
        
        let userInfo = response[0];
        // ("userinfo",userInfo);
        
        if (userInfo) {
            if (userInfo.is_active == 1) {
                if (userInfo.is_deleted == 0) {
                    if (userInfo.is_verified == 1) {
                        const isMatch = await bcrypt.compare(request_data.password, userInfo.password);
                        if (isMatch) {
                            let role = userInfo.role
                            let id = userInfo.id
                            let generatedToken = common.generateToken(id, role)
                            let tokenresponse = await common.storeToken(id, generatedToken)
                            if (tokenresponse) {
                                // await common.updateLoginFlag(id)
                                return ({
                                    code: responsecode.SUCCESS,
                                    message: { keyword: "login_successful" },
                                    data: { token: generatedToken, role: role },
                                    status: 200
                                })
                            } else {
                                // token generation error
                                return ({
                                    code: responsecode.CODE_NULL,
                                    message: { keyword: "token_generation_failed" },
                                    data: null,
                                    status: 500
                                })
                            }
                        } else {
                            // invalid credentials
                            return ({
                                code: responsecode.UNAUTHORIZED,
                                message: { keyword: "invalid_credentials" },
                                data: null,
                                status: 401
                            })
                        }
                    } else {
                        return ({
                            code: responsecode.OTP_NOT_VERIFIED,
                            message: { keyword: "email_not_verified" },
                            data: null,
                            status: 403
                        })
                    }
                } else {
                    // user deleted account signup again
                    return ({
                        code: responsecode.NOT_REGISTER,
                        message: { keyword: "account might be deleted, sign-up again" },
                        data: null,
                        status: 410
                    })
                }
            } else {
                // user blocked
                return ({
                    code: responsecode.INACTIVE_ACCOUNT,
                    message: { keyword: "you account has been blocked by admin" },
                    data: null,
                    status: 403
                })
            }
        } else {
            // user not found or signup required
            return ({
                code: responsecode.NOT_REGISTER,
                message: { keyword: "user_not_registered" },
                data: null,
                status: 404
            })
        }
    } catch (error) {
        // ("user model error", error.message)
        return ({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
    }
}
async logout(userId){
    try {
        // ("entered logout")
        // let updatequery =`update tbl_user set is_login= 0 where id=?`
        // let response = await db.query(updatequery,userId)
        // if(response.affectedRows!=0){
        let tokenresponse = await common.removeToken(userId)
        if(tokenresponse){
            // ("logged out");
            
            return({
                code: responsecode.SUCCESS,
                message: { keyword: "logout_successful" },
                data: null,
                status: 200
            })
        } else {
            return({
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "token_removal_failed" },
                data: null,
                status: 400
            })
        }
        // }else{
        //     return({
        //         code: responsecode.OPERATION_FAILED,
        //         message: { keyword: "logout_failed" },
        //         data: null,
        //         status: 400
        //     })
        // }
    } catch (error) {
        // ("server error in model", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
    }
}
async deleteaccount(request_data,user_id){
try {
    let email = request_data.email
    let password = request_data.password
let selectQuery = `select email,password from tbl_user where id =?`
let [resp] = await db.query(selectQuery,[user_id])
if(resp && resp.lenght!=0){

     const isMatch = await bcrypt.compare(password, resp[0].password);
    if(resp[0].email==email && isMatch){
        let updateQuery=`update tbl_user set is_deleted = 1 where id =?`
        let [reap1] = await db.query(updateQuery,user_id)
        if(reap1.affectedRows!=0){
            this.logout(user_id);
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'User deleted'},
                data:[],
                status:200
            })
        }
        else{
            return({
                code:2,
                message:{keyword:'unable to delete'},
                data:[],
                status:400
            })
        }
    }else{
               return({
                code:2,
                message:{keyword:'Entered data is incorrect!'},
                data:[],
                status:400
            })
    }
    
    }
} catch (error) {
    // (error);
    
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
}
}
async  forgotpassword(request_data) {
  try {
    let email = request_data.email;

    let checkquery = `SELECT id, email, is_verified, is_active, is_deleted FROM tbl_user WHERE email = ? ORDER BY id DESC LIMIT 1`;
    let [response] = await db.query(checkquery, [email]);

    if (response && response.length != 0) {
      let user = response[0];

      if (user.is_verified == 1) {
        if (user.is_active == 1) {
          if (user.is_deleted == 0) {
            // success id
            let vrificationcode = common.generateRandomCode();
            let storedcodeflag = common.storeToken(user.id, vrificationcode);

            if (storedcodeflag) {
              const emailBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; border-radius: 8px;">
  <h2 style="color: #333;">Password Reset Verification</h2>
  <p>Hello,</p>
  <p>We received a request to reset your password on <strong>Lokotsav</strong>.</p>
  <p>Please use the verification code below to continue resetting your password:</p>
  <div style="font-size: 24px; font-weight: bold; margin: 20px 0; color: #2d8cf0;">${vrificationcode}</div>
  <p>Enter this code in the application to proceed with resetting your password.</p>
  <p>If you didn’t request this, you can safely ignore this email.</p>
  <p style="margin-top: 20px; color: #888;">Tip: If you can't find this email, please check your Spam or Promotions folder.</p>
</div>

              `;

              try {
                await sendEmail(user.email, "Reset your Lokotsav Password", emailBody, 'forgot-password');

                return {
                  code: responsecode.SUCCESS,
                  message: { keyword: 'Verification mail sent to your registered mail' },
                  data: [user.id],
                  status: 200
                };

              } catch (emailError) {
                
                  return {
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: emailError.message },
                    data: [],
                    status: 500
                  };
               
              }

            } else {
              return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: 'Failed to store token' },
                data: [],
                status: 400
              };
            }

          } else {
            return {
              code: responsecode.OPERATION_FAILED,
              message: { keyword: 'your account has been deleted' },
              data: [],
              status: 400
            };
          }

        } else {
          return {
            code: responsecode.OPERATION_FAILED,
            message: { keyword: 'your account has been blocked' },
            data: [],
            status: 400
          };
        }

      } else {
        return {
          code: responsecode.OPERATION_FAILED,
          message: { keyword: 'your account has not verified yet' },
          data: [],
          status: 400
        };
      }

    } else {
      return {
        code: responsecode.CODE_NULL,
        message: { keyword: 'you not yet registered with this email' },
        data: [],
        status: 400
      };
    }

  } catch (error) {
    console.error('Forgot Password Error:', error);

    return {
      code: responsecode.SERVER_ERROR,
      message: { keyword: "internal_server_error" },
      data: [],
      status: 500
    };
  }
}
async verifycode(request_data){
    try {
        let id =  request_data.id
        let code = request_data.code
        let [resp] = await db.query('select id from tbl_device where user_id=? and user_token=?',[id,code])
        if(resp && resp.lenght!=0){
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'verification completd'},
                data: resp[0].id,
                status:200
            })
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:'no data found'},
                data:[],
                status:400
            })
        }
    } catch (error) {
          return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: [],
            status: 500
        })
    }
}
async  resetPassword(request_data) {
    try {
        const { id, newPassword } = request_data;

        if (!id || !newPassword) {
            return {
                code: responsecode.VALIDATION_ERROR,
                message: { keyword: 'id_and_password_required' },
                data: [],
                status: 400
            };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [result] = await db.query(
            'UPDATE tbl_user SET password = ? WHERE id = ?',
            [hashedPassword, id]
        );

        if (result.affectedRows > 0) {
            return {
                code: responsecode.SUCCESS,
                message: { keyword: 'password_reset_success' },
                data: [],
                status: 200
            };
        } else {
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: 'user_not_found_or_update_failed' },
                data: [],
                status: 400
            };
        }

    } catch (error) {
        console.error('Reset password error:', error);
        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: 'internal_server_error' },
            data: [],
            status: 500
        };
    }
}

async eventListing(){
    try {
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and is_approved=1`
        let [response] = await db.query(selectQuery);
        if(response && response.length > 0){
            // ('response',response);
            
            return({
                code: responsecode.SUCCESS,
                message: { keyword: "events_fetched" },
                data: response,
                status: 200
            })
        } else {
            return({
                code: responsecode.NO_DATA_FOUND,
                message: { keyword: "no_events_found" },
                data: [],
                status: 200
            })
        }
    } catch (error) {
        // ("model error", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: [],
            status: 500
        })
    }
}
async displayEvent(eventId){
    try {
        console.log("uuuuuuuuuuuuuuuuu",eventId);
        
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and id = ?`
        let [response] = await db.query(selectQuery, eventId.id);
        if(response && response.length > 0){
            // (response);
            
            return({
                code: responsecode.SUCCESS,
                message: { keyword: "event_fetched" },
                data: response[0],
                status: 200
            })
        } else {
            return({
                code: responsecode.NO_DATA_FOUND,
                message: { keyword: "event_not_found" },
                data: [],
                status: 404
            })
        }
    } catch (error) {
        console.log("model error", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: `internal_server_erroer ${error.message}` },
            data: [],
            status: 500
        })
    }
}
async featuredEvents(){
    try {
        let selectQuery = `select id,is_featured,event_title,category,start_time,city,description,location,registrations,cover_image from tbl_event where is_active=1 and is_deleted=0 and is_approved=1 and is_featured=1 order by start_time limit 10`
        let [response] = await db.query(selectQuery);
        if(response && response.length > 0){
            // ('response',response);
            
            return({
                code: responsecode.SUCCESS,
                message: { keyword: "featured_events_fetched" },
                data: response,
                status: 200
            })
        } else {
            return({
                code: responsecode.NO_DATA_FOUND,
                message: { keyword: "no_featured_events_found" },
                data: [],
                status: 200
            })
        }
    } catch (error) {
        // ("model error", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: [],
            status: 500
        })
    }
}
async getBookmarkStatus(event_id, user_id){
    try {
        // (user_id);
        // (event_id.event_id);
        
        let Selectquery = `select is_bookmarked from tbl_event_bookmark where event_id = ? and user_id=?`
        let [responsee] = await db.query(Selectquery, [event_id.event_id, user_id]) 
        // ('res2',responsee);
        
        let response = responsee[0]
        // ('res',response);
        
        if(response){
            return ({
                code: responsecode.SUCCESS,
                message: { keyword: "bookmark_status_found" },
                data: response,
                status: 200
            })
        } else {
            return ({
                code: responsecode.NO_DATA_FOUND,
                message: { keyword: "bookmark_status_not_found" },
                data: null,
                status: 200
            })
        }
    } catch (error) {
        // ("model error", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
    }
}
async bookmark(event_id, user_id) {
    try {
        // ("event_id:", event_id);
        // ("user_id:", user_id);

        const selectQuery = `
            SELECT is_bookmarked 
            FROM tbl_event_bookmark 
            WHERE event_id = ? AND user_id = ?
        `;
        const [rows] = await db.query(selectQuery, [event_id.event_id, user_id]);
        // ("Select Query:", selectQuery);
        // ("Query Result:", rows);

        let updateQuery;
        let queryParams;

        if (rows.length == 0) {
    
            updateQuery = `
                INSERT INTO tbl_event_bookmark (is_bookmarked, event_id, user_id) 
                VALUES (1, ?, ?)
            `;
            queryParams = [event_id.event_id, user_id];
        } else {
        
            const isBookmarked = rows[0].is_bookmarked;
            const newStatus = isBookmarked === 1 ? 0 : 1;
            updateQuery = `
                UPDATE tbl_event_bookmark 
                SET is_bookmarked = ? 
                WHERE event_id = ? AND user_id = ?
            `;
            queryParams = [newStatus, event_id.event_id, user_id];
        }

        const [updateResponse] = await db.query(updateQuery, queryParams);

        if (updateResponse.affectedRows !== 0) {
            return {
                code: responsecode.SUCCESS,
                message: { keyword: "bookmarked_successfully" },
                data: rows[0] || { is_bookmarked: 1 },
                status: 200
            };
        } else {
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "bookmark_failed" },
                data: null,
                status: 400
            };
        }

    } catch (error) {
        // ("model error:", error.message);
        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: "txt_server_error" },
            data: null,
            status: 500
        };
    }
}
async createEvent (requestData,user_id){
    try {
        // (requestData)
            let insertQuery = `insert into tbl_event set ?`
    //         `    INSERT INTO tbl_product (category_id, product_name, price, description, image)
    //     VALUES (?, ?, ?, ?, ?)
    //   `;
            let eventData = {
                user_id: user_id,
                event_title: requestData.event_title,
                start_time: requestData.start_time,
                end_time:requestData.end_time,
                city:requestData.city,
                category:requestData.category,
                description:requestData.description,
                cover_image:'https://placehold.co/600x400?text=User+created+Event',
                tips:requestData.tips,
                cultural_significance:requestData.cultural_significance,
                location:requestData.location,
               total_tickets:requestData.total_tickets,
               tickets_left:requestData.tickets_left,
               ticket_price:requestData.ticket_price
               
            }
            let [response] = await db.query(insertQuery,[eventData])
            // (insertQuery);
            
            // (response);
            
            if(response.affectedRows!=0){
                 return({
                    code:responsecode.SUCCESS,
                    message:{keyword:"event_created_successfully"},
                    data:null,
                    status:201
                 })
            }else{
                    return({
                        code:responsecode.OPERATION_FAILED,
                        message:{keyword:"failed_to_add_event"},
                        data:null,
                        status:400
                    })
            }
        } catch (error) {
            // ("modle error",error.message)
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:null,
                status:500
            })
        }
}
async getBookmarkedEvents(user_id){
        try {
            // (user_id);
            
            let Selectquery = `SELECT e.*
FROM tbl_event e
JOIN tbl_event_bookmark eb
  ON e.id = eb.event_id
WHERE eb.user_id = ?
  AND eb.is_bookmarked = 1
  AND eb.is_deleted = 0
  AND eb.is_active = 1;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // (response);
            
           if(response){
            // let eventData = await this.displayEvent(response)
            return ({
                code:responsecode.SUCCESS,
                message:{keyword:"bookmark found"},
                data: response ,
                status:200
            })
        }else{
            return ({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"no bookamrked events found"},
                data: [],
                status:200
            })
        }
        } catch (error) {
            // ('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
        }
}
async getsubmitted(user_id){
        try {
            // (user_id);
            
            let Selectquery = `SELECT e.*
FROM tbl_event e
JOIN tbl_user u ON e.user_id = u.id
WHERE u.role = 'user'and u.id=?;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // (response);
            
           if(response){
            // let eventData = await this.displayEvent(response)
            return ({
                code:responsecode.SUCCESS,
                message:{keyword:"submitted events fetched"},
                data: response ,
                status:200
            })
        }else{
            return ({
                code:responsecode.NO_DATA_FOUND,
                message:{keyword:"no submitted events found"},
                data: [],
                status:200
            })
        }
        } catch (error) {
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
        }
}
async searchEvent(searchTerm){
    try {
        // ("search term",searchTerm);
        let selectQuery = `SELECT * FROM tbl_event WHERE is_active=1 AND is_deleted=0 and is_approved=1`;
        let params = [];

    if (searchTerm.s) {
  selectQuery += ` AND LOWER(event_title) LIKE ?`;
  params.push(`%${searchTerm.s.toLowerCase()}%`);
}
if (searchTerm.city) {
  selectQuery += ` AND LOWER(city) = ?`;
  params.push(searchTerm.city.toLowerCase());
}

// 
        // ("Final SQL Query:", selectQuery);
        // ("With Params:", params);
// 
        let [response] = await db.query(selectQuery, params);
        // ("Search Result:", response);
    //    ("Final SQL Query:", selectQuery);
    //    ("Search Term Passed:", `%${searchTerm.event_title}%`);
       
       if(response){
        // ("search displayed",response[0]);
return({
    
    
    code:responsecode.SUCCESS,
    message:{keyword:"event_fetched"},
    data:response,
    status:200
})

       }else{
        return({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"event_not_found"},
            data:[],
            status:200
        })
       }
    } catch (error) {
        // ("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:[],
            status:500
        })
    }
}
async approvedEvents(user_id){
         try {
            // (user_id);
            
            let Selectquery = `select id,event_title, category, start_time,end_time,city,cover_image,cultural_significance,tips,description,location,registrations from tbl_event where user_id= ? and is_active=1 and is_deleted=0 and is_approved=1;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // (response);
            
           if(response){
            // let eventData = await this.displayEvent(response)
            return ({
                code:responsecode.SUCCESS,
                message:{keyword:"approved events found"},
                data: response ,
                status:200
            })
        }else{
            return ({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"events not found"},
                data: [],
                status:200
            })
        }
        } catch (error) {
            // ('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
        }
}
async UnapprovedEvents(user_id){
         try {
            // (user_id);
            
            let Selectquery = `select id,event_title, category, start_time,city,cover_image,description,location,registrations from tbl_event where user_id= ? and is_active=1 and is_deleted=0 and is_approved=0;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // (response);
            
           if(response){
            // let eventData = await this.displayEvent(response)
            return ({
                code:responsecode.SUCCESS,
                message:{keyword:"unapproved events found"},
                data: response ,
                status:200
            })
        }else{
            return ({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"events not found"},
                data:[],
                status:200
            })
        }
        } catch (error) {
            // ('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
        }
}
async category(request_data){
    try {
        // (request_data);
        
        const selectQuery = `select id,category,event_title,cover_image,start_time,description,city,location,is_featured,registrations from tbl_event where is_active=1 and is_deleted=0 and is_approved=1 and category=?`
        const [response] =await db.query(selectQuery,[request_data.v])
        if(response){
            // (response);
            
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'category found'},
                data:response,
                status:200
            })
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:'category not found'},
                data:[],
                status:200
            })
        }

    } catch (error) {
        //  ('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async checkBookingStatus(request_data, user_id) {
    try {
        const event_id = request_data.id;

        const selectQuery = `
            SELECT quantity, id FROM tbl_order 
            WHERE is_active = 1 AND is_deleted = 0 
            AND status = 'pending' AND order_type = 'buy-tickets' 
            AND user_id = ? AND event_id = ? LIMIT 1
        `;
        const [response] = await db.query(selectQuery, [user_id, event_id]);

        if (response && response.length !== 0) {
            return {
                code: 1,
                message: { keyword: 'order is already placed' },
                data: response,
                status: 200
            };
        }

        const ticketsBookedQuery = `
            SELECT SUM(quantity) as total_booked FROM tbl_order 
            WHERE is_active = 1 AND is_deleted = 0 
            AND user_id = ? AND event_id = ? AND order_type = 'buy_tickets'
        `;
        const [res1] = await db.query(ticketsBookedQuery, [user_id, event_id]);

        const totalBooked = res1[0].total_booked || 0;

        if (totalBooked > 10) {
            return {
                code: 45,
                message: { keyword: `You can purchase only ${10 - totalBooked} tickets` },
                data: [],
                status: 400
            };
        }

        return {
            code: 8,
            message: { keyword: "You can book tickets" },
            data: [],
            status: 200
        };
    } catch (error) {
        // ("Server /Error:", error.message);
        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: "Server error occurred" },
            data: [],
            status: 500
        };
    }
}
async createOrder(request_data,user_id){
    try {
        // (request_data);
      let event_id = request_data.event_id;
                     let ticketsBooked = `select sum(quantity) as total_booked from tbl_order where is_active=1 and is_deleted=0 and status = 'paid' and user_id=? and event_id=? and order_type='buy-tickets'`
            let [res1] = await db.query(ticketsBooked,[user_id,event_id])
            // ('weew',res1);
            let final_total_tickets = Number(res1[0].total_booked)+Number(request_data.quantity)
            if(final_total_tickets > 10){
                return ({
                    code:responsecode.OPERATION_FAILED,
                    message:{keyword:`You can purchase only ${ 10-Number(res1[0].total_booked)}`},
                    data:[],
                    status:400
                })
            }
        
        
        let quantity = request_data.quantity
        let total_amount = request_data.total_amount;
        let order_type = 'buy-tickets'
        let insertQuery= 'insert into tbl_order set ?'
      const [response] = await db.query(insertQuery, {
  user_id,
  event_id,
  quantity,
  total_amount,
  order_type
});
       (insertQuery);
       let order_id = response.insertId
        if(response.affectedRows==0){
            return ({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"failed to place order"},
                data:[],
                status:401
            })
        }else{
            return({
                   code:responsecode.SUCCESS,
                message:{keyword:"Tickets has been booked! Pay the amount"},
                data:[order_id],
                status:200
            })
        }

    } catch (error) {
        // ("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
async updateOrder(request_data) {
    try {
        // (request_data);
        
        let id = request_data.order_id;
        let total_amount = request_data.total_amount;
        let quantity = request_data.quantity;

        let selectquery = `SELECT user_id, event_id FROM tbl_order WHERE id = ? and order_type="buy-tickets"`;
        let [orderResult] = await db.query(selectquery, [id]);

        if (orderResult && orderResult.length !== 0) {
            let user_id = orderResult[0].user_id;
            let event_id = orderResult[0].event_id;

            let ticketsBooked = `
                SELECT SUM(quantity) AS total_booked 
                FROM tbl_order 
                WHERE is_active = 1 
                AND is_deleted = 0 
           and status ='paid'
                AND user_id = ? 
                AND event_id = ?
                and order_type = 'buy-tickets'
            `;

            let [bookedResult] = await db.query(ticketsBooked, [user_id, event_id]);
            // ('weew', bookedResult);
let final_total_tickets = Number(bookedResult[0].total_booked) + Number(quantity)

            if (final_total_tickets > 10) {
                // (final_total_tickets);
                
                return {
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: `You have booked ${ final_total_tickets-10} tickets extra ` },
                    data: [],
                    status: 400
                };
            }
        }

        let updateQuery = `
            UPDATE tbl_order 
            SET quantity = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND status = 'pending' and order_type = 'buy-tickets'
        `;

        let [updateResult] = await db.query(updateQuery, [quantity, total_amount, id]);

        if (updateResult.affectedRows !== 0) {
            return {
                code: responsecode.SUCCESS,
                message: { keyword: "updation completed" },
                data: [],
                status: 200
            };
        } else {
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "order updation failed" },
                data: [],
                status: 401
            };
        }

    } catch (error) {
        // (error);

        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: "server error occured" },
            data: [],
            status: 500
        };
    }
}
async getPaymentDetails(request_data,user_id){
        try {
        let order_id = request_data.id;
        let selectQuery = `SELECT 
    u.username,
    o.order_type,
    e.event_title,
    o.total_amount
FROM 
    tbl_order o
JOIN 
    tbl_user u ON o.user_id = u.id
JOIN 
    tbl_event e ON o.event_id = e.id where o.id =? and u.id=? and o.is_active=1 and status='pending' ;`
       let [response] = await db.query(selectQuery,[order_id,user_id])
         if(!response || response.length==0) {
           
                return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:'No order placed yet'},
                    data:[],
                    status:200
                })
            }else{
                return ({
                    code:responsecode.SUCCESS,
                    message:{keyword:'order is placed!'},
                    data:response,
                    status:200
                })
            }
         
    } catch (error) {
        //    ("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
async payment(request_data) {
    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        let order_id = request_data.id;
        let orderselectQuery = `SELECT id, order_type, user_id, event_id, quantity, total_amount, status 
                               FROM tbl_order WHERE id = ? AND is_active = 1`;
        let [response] = await connection.query(orderselectQuery, [order_id]);

        if (response.length === 0) {
            await connection.rollback();
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: 'No active order found' },
                data: [],
                status: 400
            };
        }

        response = response[0];

        // Update order status first
        let updateOrder = `UPDATE tbl_order 
                          SET status = 'paid', updated_at = CURRENT_TIMESTAMP 
                          WHERE id = ? AND status = 'pending' AND is_active = 1`;
        let [res1] = await connection.query(updateOrder, [order_id]);

        if (res1.affectedRows === 0) {
            await connection.rollback();
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "Order update failed" },
                data: [],
                status: 400
            };
        }

        // Handle different order types
        if (response.order_type === 'buy-tickets') {
            // Verify tickets are available before processing
            let checkTickets = `SELECT tickets_left FROM tbl_event 
                              WHERE id = ? AND is_active = 1 AND is_approved = 1 
                              AND tickets_left >= ?`;
            let [ticketCheck] = await connection.query(checkTickets, 
                              [response.event_id, response.quantity]);

            if (ticketCheck.length === 0) {
                await connection.rollback();
                return {
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: "Not enough tickets available" },
                    data: [],
                    status: 400
                };
            }

            // Update event registrations and tickets
            let updateEvent = `UPDATE tbl_event 
                             SET registrations = registrations + ?, 
                                 tickets_left = tickets_left - ? 
                             WHERE id = ? AND is_active = 1 AND is_approved = 1`;
            let [res2] = await connection.query(updateEvent, 
                             [response.quantity, response.quantity, response.event_id]);

            if (res2.affectedRows === 0) {
                await connection.rollback();
                return {
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: "Event update failed" },
                    data: [],
                    status: 400
                };
            }
        } else {
            // For featured events
            let updateEvent = `UPDATE tbl_event 
                             SET is_featured = 1 
                             WHERE id = ? AND is_active = 1 AND is_approved = 1`;
            let [res2] = await connection.query(updateEvent, [response.event_id]);

            if (res2.affectedRows === 0) {
                await connection.rollback();
                return {
                    code: responsecode.OPERATION_FAILED,
                    message: { keyword: "Event feature update failed" },
                    data: [],
                    status: 400
                };
            }
        }

        // Create payment record
        let insertPayment = `INSERT INTO tbl_payment SET ?`;
        let [res3] = await connection.query(insertPayment, {
            order_id: response.id,
            status: 'succeeded',
            amount_paid: response.total_amount
        });

        if (res3.affectedRows === 0) {
            await connection.rollback();
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "Payment creation failed" },
                data: [],
                status: 400
            };
        }

        await connection.commit();
        return {
            code: responsecode.SUCCESS,
            message: { keyword: 'PAYMENT Success!!' },
            data: [],
            status: 200
        };

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Payment error:", error);
        return {
            code: responsecode.SERVER_ERROR,
            message: { keyword: "Server error occurred" },
            data: [],
            status: 500
        };
    } finally {
        if (connection) connection.release();
    }
}
async getEventsForFeature(user_id){
         try {
            // (user_id);
            
            let Selectquery = `select id,event_title, category, start_time,end_time,city,cover_image,cultural_significance,tips,description,location,registrations from tbl_event where user_id= ? and is_active=1 and is_deleted=0 and is_approved=1 and is_featured=0;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // (response);
            
           if(response){
            // let eventData = await this.displayEvent(response)
            return ({
                code:responsecode.SUCCESS,
                message:{keyword:"approved events found"},
                data: response ,
                status:200
            })
        }else{
            return ({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"events not found"},
                data: [],
                status:200
            })
        }
        } catch (error) {
            // ('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
        }
}
async featureorder(request_data,user_id){
    try {
        let event_id = request_data.id

        let insertquery = `insert into tbl_order set ?`
        let [response] = await db.query(insertquery,{total_amount:99,quantity:1,order_type:'featured',user_id:user_id,event_id:event_id})
        if(response.affectedRows!=0){
            let order_id = response.insertId
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'Order generated '},
                data:order_id,
                status:200
            })
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:'failed to order feature event'},
                data:[],
                status:400
            })
        }
    } catch (error) {
               return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async orderDetails(user_id){
    try {
        let selectQuery = `SELECT 
    p.id AS payment_id,
    p.amount_paid,
    p.status AS payment_status,
    p.payment_time,
    o.id AS order_id,
    o.order_type,
    o.total_amount,
    o.status AS order_status,
    e.event_title

FROM tbl_payment p
JOIN tbl_order o ON p.order_id = o.id
JOIN tbl_event e ON o.event_id = e.id
WHERE o.user_id = ? AND p.is_active = 1
ORDER BY p.payment_time DESC;
`
        let [res1] = await db.query(selectQuery,user_id)
        if(res1 && res1.length!=0){
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'orders fetched'},
                data:res1,
                status:200
            })
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:'failed to fetch oreder'},
                data:[],
                status:400
            })
        }
    } catch (error) {
        // ('server err',error);
        
               return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async trendingEvents(){
    try {
        let selectQuery = `SELECT 
    id ,
    event_title,
    cover_image,
    category,
    city,
    location,
    description,
    start_time,
    end_time,
    registrations,
    is_featured
FROM tbl_event
WHERE 
    is_active = 1
    AND is_approved = 1
    AND is_deleted = 0
ORDER BY 
    registrations DESC
LIMIT 8;
`
let [res] = await db.query(selectQuery)
if(res && res.length !=0){
    return({
        code:responsecode.SUCCESS,
        message:{keyword:'trending event found'},
        data:res,
        status:200
    })
} else{
    return({
        code:responsecode.OPERATION_FAILED,
        message:{keyword:'no tranding event found'},
        data:[],
        status:400
    })
}
    } catch (error) {
                 return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async totalUser(){
    try {
        let selsctquery= 'SELECT COUNT(*) AS total_active_verified_users FROM tbl_user WHERE is_active = 1 AND is_verified = 1 AND is_deleted = 0;'
        let [response] = await db.query(selsctquery)
        if(response && response.length!=0){
            let users = String(response[0].total_active_verified_users)
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'recieved'},
                data:users,
                status:200
            })
        }
        else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyord:'failed'},
                data:[],
                status:400
            })
        }
    } catch (error) {
              return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async totalEvents(){
    try {
        let selsctquery= `SELECT COUNT(*) AS total_events
FROM tbl_event
 WHERE is_active = 1  AND is_deleted = 0 and is_approved=1`
        let [response] = await db.query(selsctquery)
        if(response && response.length!=0){
            let events = String(response[0].total_events)
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'recieved'},
                data:events,
                status:200
            })
        }
        else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyord:'failed'},
                data:[],
                status:400
            })
        }
    } catch (error) {
              return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async totalFeaturedEvents(){
    try {
        let selsctquery= `SELECT COUNT(*) AS total_featured
FROM tbl_event
 WHERE is_active = 1  AND is_deleted = 0 and is_approved=1 and is_featured =1`
        let [response] = await db.query(selsctquery)
        if(response && response.length!=0){
            let fevents = String(response[0].total_featured)
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'recieved'},
                data:fevents,
                status:200
            })
        }
        else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyord:'failed'},
                data:[],
                status:400
            })
        }
    } catch (error) {
              return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async tottalticketssold(){
    try {
        let selsctquery= `SELECT sum(quantity) as total_tickets from tbl_order where status = 'paid' and order_type='buy-tickets'`
        let [response] = await db.query(selsctquery)
        if(response && response.length!=0){
            let tickets =String(response[0].total_tickets)
            return({
                code:responsecode.SUCCESS,
                message:{keyword:'recieved'},
                data:tickets,
                status:200
            })
        }
        else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyord:'failed'},
                data:[],
                status:400
            })
        }
    } catch (error) {
              return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
}module.exports = new UserModel();