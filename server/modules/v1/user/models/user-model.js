const db = require("../../../../config/database");
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code")
const bcrypt = require("bcrypt");
const sendEmail = require("../../../../utilities/sendEmail")

 class UserModel{
async signup(request_data){ 
    try{
        // console.log("signup entered")
        // console.log("data",request_data);
        
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
            // console.log(insertQuery)
            // console.log(queryResponse)
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

  await sendEmail(request_data.email, "Verify Your Lokotsav Account", emailBody);

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
        console.log(error)
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
        console.log(request_data);
        
        const otp = request_data.otp;

        const userQuery = "SELECT user_id FROM tbl_otp WHERE otp = ? AND is_active = 1";
        const [userResult] = await db.query(userQuery, [otp]);

        if (userResult.length == 0) {
            return {
                code: responsecode.OTP_NOT_VERIFIED,
                message: { keyword: "invalid_otp" },
                data: null,
                status: 400
            };
        } else {
            const user_id = userResult[0].user_id;
            const checkuser = 'select is_verified from tbl_user where is_active=1 and is_deleted = 0 and id= ? '
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
async login(request_data){
    try {
        let email = request_data.email

        let selectQuery = `select id,role,email,password,is_active,is_deleted,is_verified from tbl_user where email = ?`
        // console.log("query",selectQuery);
        
        const [response] = await db.query(selectQuery, email)
        // console.log("res",response);
        
        let userInfo = response[0];
        // console.log("userinfo",userInfo);
        
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
                        message: { keyword: "account_deleted" },
                        data: null,
                        status: 410
                    })
                }
            } else {
                // user blocked
                return ({
                    code: responsecode.INACTIVE_ACCOUNT,
                    message: { keyword: "account_blocked" },
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
        console.log("user model error", error.message)
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
        console.log("entered logout")
        // let updatequery =`update tbl_user set is_login= 0 where id=?`
        // let response = await db.query(updatequery,userId)
        // if(response.affectedRows!=0){
        let tokenresponse = await common.removeToken(userId)
        if(tokenresponse){
            console.log("logged out");
            
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
        console.log("server error in model", error.message)
        return({
            code: responsecode.SERVER_ERROR,
            message: { keyword: "internal_server_error" },
            data: null,
            status: 500
        })
    }
}
async eventListing(){
    try {
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and is_approved=1`
        let [response] = await db.query(selectQuery);
        if(response && response.length > 0){
            // console.log('response',response);
            
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
        console.log("model error", error.message)
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
        // console.log("uuuuuuuuuuuuuuuuu",eventId);
        
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and id = ?`
        let [response] = await db.query(selectQuery, eventId.id);
        if(response && response.length > 0){
            // console.log(response);
            
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
            message: { keyword: "internal_server_error" },
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
            // console.log('response',response);
            
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
        console.log("model error", error.message)
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
        // console.log(user_id);
        // console.log(event_id.event_id);
        
        let Selectquery = `select is_bookmarked from tbl_event_bookmark where event_id = ? and user_id=?`
        let [responsee] = await db.query(Selectquery, [event_id.event_id, user_id]) 
        // console.log('res2',responsee);
        
        let response = responsee[0]
        // console.log('res',response);
        
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
        console.log("model error", error.message)
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
        // console.log("event_id:", event_id);
        // console.log("user_id:", user_id);

        const selectQuery = `
            SELECT is_bookmarked 
            FROM tbl_event_bookmark 
            WHERE event_id = ? AND user_id = ?
        `;
        const [rows] = await db.query(selectQuery, [event_id.event_id, user_id]);
        // console.log("Select Query:", selectQuery);
        // console.log("Query Result:", rows);

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
        console.log("model error:", error.message);
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
        // console.log(requestData)
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
                cover_image:requestData.cover_image,
                tips:requestData.tips,
                cultural_significance:requestData.cultural_significance,
                location:requestData.location,
               
               
            }
            let [response] = await db.query(insertQuery,[eventData])
            // console.log(insertQuery);
            
            // console.log(response);
            
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
            console.log("modle error",error.message)
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
            // console.log(user_id);
            
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
            // console.log(response);
            
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
            console.log('server error',error.message);
            
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
            console.log(user_id);
            
            let Selectquery = `SELECT e.*
FROM tbl_event e
JOIN tbl_user u ON e.user_id = u.id
WHERE u.role = 'user'and u.id=?;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            console.log(response);
            
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
        console.log("search term",searchTerm);
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
        // console.log("Final SQL Query:", selectQuery);
        // console.log("With Params:", params);
// 
        let [response] = await db.query(selectQuery, params);
        // console.log("Search Result:", response);
    //    console.log("Final SQL Query:", selectQuery);
    //    console.log("Search Term Passed:", `%${searchTerm.event_title}%`);
       
       if(response){
        // console.log("search displayed",response[0]);
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
        console.log("modle error",error.message)
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
            // console.log(user_id);
            
            let Selectquery = `select id,event_title, category, start_time,end_time,city,cover_image,cultural_significance,tips,description,location,registrations from tbl_event where user_id= ? and is_active=1 and is_deleted=0 and is_approved=1;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // console.log(response);
            
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
            console.log('server error',error.message);
            
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
            // console.log(user_id);
            
            let Selectquery = `select id,event_title, category, start_time,city,cover_image,description,location,registrations from tbl_event where user_id= ? and is_active=1 and is_deleted=0 and is_approved=0;`
            let [responsee]  = await db.query(Selectquery,[user_id]) 
            let response = responsee
            // console.log(response);
            
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
            console.log('server error',error.message);
            
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
        // console.log(request_data);
        
        const selectQuery = `select id,category,event_title,cover_image,start_time,description,city,location,is_featured,registrations from tbl_event where is_active=1 and is_deleted=0 and is_approved=1 and category=?`
        const [response] =await db.query(selectQuery,[request_data.v])
        if(response){
            // console.log(response);
            
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
         console.log('server error',error.message);
            
            return({
                code:responsecode.SERVER_ERROR,
                message:{keyword:"txt_server_error"},
                data:[],
                status:500
            })
    }
}
async checkBookingStatus(request_data,user_id){
    try {
        // console.log(request_data);
        
        let event_id = request_data.id;
        // console.log('wewewewewe',event_id,user_id);
        
        let selectQuery = `select quantity,id from tbl_order where is_active=1 and is_deleted = 0 and status='pending' and user_id=? and event_id=? limit 1`
       let [response] = await db.query(selectQuery,[user_id,event_id])
    //    console.log('reererere',response);
       
         if(response) {
            if(response.length==0){
                return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:'No order placed yet0'},
                    data:[],
                    status:200
                })
            }else{
                return ({
                    code:responsecode.SUCCESS,
                    message:{keyword:'order is already placed'},
                    data:response,
                    status:200
                })
            }
         }else{
               return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:'No order placed yet'},
                    data:[],
                    status:200
                })
         }
    } catch (error) {
           console.log("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
async createOrder(request_data,user_id){
    try {
        console.log(request_data);
        
        let event_id = request_data.event_id;
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
       console.log(insertQuery);
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
                message:{keyword:"Tickets has been booked!"},
                data:[order_id],
                status:200
            })
        }

    } catch (error) {
        console.log("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
async updateOrder(request_data){
    try {
        let id = request_data.order_id
        let total_amount = request_data.total_amount
        let quantity = request_data.quantity
        let updateQuery = `UPDATE tbl_order SET quantity = ?, total_amount = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending'`
        let response = await db.query(updateQuery,[quantity,total_amount,id])
        if(response.affectedRows!=0){
            return({
                code:responsecode.SUCCESS,
                message:{keyword:"updation completed"},
                data:[],
                status:200
            })
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{keyword:"order updation failed"},
                data:[],
                status:401
            })
        }
    } catch (error) {
              return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
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
         if(response) {
            if(response.length==0){
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
         }else{
               return({
                    code:responsecode.CODE_NULL,
                    message:{keyword:'No order placed yet'},
                    data:[],
                    status:200
                })
         }
    } catch (error) {
           console.log("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
async payment(request_data){
    try {
let order_id = request_data.id;
let orderselectQuery = `select id,order_type,user_id,event_id,total_amount from tbl_order where id = ?`
let [response] = await db.query(orderselectQuery,[order_id])
if(response){
    if(response.order_status=='buy-tickets'){
let updateOrder = `UPDATE tbl_order SET is_deleted = 1, is_active = 0,status='paid' updated_at = CURRENT_TIMESTAMP WHERE id = ? AND status = 'pending' `
    }else{
        //fetured event payment
        //update is_featured = 1
    }
}else{
    //no response founf1
}
    } catch (error) {
        console.log("server errror",error.message);
        
            return({
                   code:responsecode.SERVER_ERROR,
                message:{keyword:"server error occured"},
                data:[],
                status:500
            })
    }
}
}module.exports = new UserModel();