const db = require("../../../../config/database");
const common = require("../../../../utilities/common");
const responsecode = require("../../../../utilities/response-error-code")
const bcrypt = require("bcrypt");

 class UserModel{
        async signup(request_data){ 

        try{
            console.log("signup entered")
            // console.log("data",request_data);
            
            const checkUniqueEmail = await common.checkEmail(request_data.email)
            if(!checkUniqueEmail){
              const checkUniquePhone = await common.checkPhone(request_data.phone)
              if(!checkUniquePhone){
                const hashedPassword = await bcrypt.hash(request_data.password, 10);
                const userData = {
                    username : request_data.username,
                    phone: request_data.phone,
                    email:request_data.email,
                    password: hashedPassword
                }
                const insertQuery = `insert into tbl_user set ?`
                const [queryResponse] = await db.query(insertQuery,[userData])
                // console.log(insertQuery)
                // console.log(queryResponse)
                if(queryResponse.affectedRows==0){
                    return({
                        code:responsecode.OPERATION_FAILED,
                        message:{keyword:"txt_insertion_error"},
                        data:null,
                        status:400
                    })
                }else{
                    return({
                          code:responsecode.SUCCESS,
                          message:{keyword:"txt_signup_success"},
                          data:queryResponse.insertId,
                          status:200
                    })
                }
              }else{
                return ({
                    code: responsecode.OPERATION_FAILED,
                    message: {keyword:"txt_phone_already_exists"},
                    data : null,
                    status:400
                })
              }
            }else{
                return ({
                    code: responsecode.OPERATION_FAILED,
                    message: {keyword:"txt_email_already_exists"},
                    data : null,
                    status:400
                })
            }
        }catch(error){
            console.log(error)
            return({
                code: responsecode.OPERATION_FAILED,
                    message: {keyword:"txt_internal_server_error"},
                    data : error.message,
                    status:500
            })
        }
    }
    async login(request_data){
      
      try{
        let field = 'email'
        let dataas = request_data.email
       if(request_data.email==null){
        field = 'phone'
        dataas = request_data.phone;
       }
    //    let data= request_data.${field}
        let selectQuery= `select id,role,email , password,is_active,is_deleted from tbl_user where ${field} = ?`
        // console.log("query",selectQuery);
        
        const [response] = await db.query(selectQuery,dataas)
        // console.log("res",response);
        
        let userInfo = response[0];
        // console.log("userinfo",userInfo);
        
        if(userInfo){
              if(userInfo.is_active==1){
                 if(userInfo.is_deleted==0){
                    // if(userInfo.is_login == 0){
                    const isMatch = await bcrypt.compare(request_data.password, userInfo.password);
                    if (isMatch){
                              let role = userInfo.role
                              let id= userInfo.id
                              let generatedToken = common.generateToken(id,role)
                              let tokenresponse = await common.storeToken(id,generatedToken)
                              if(tokenresponse){
                            //    await common.updateLoginFlag(id)
                                return ({
                                    code :responsecode.SUCCESS,
                                    message:{keyword:"txt_login_success"},
                                    data:{token:generatedToken,role:role},
                                    status:200
                                })
                              }else{
                                //token genertation errro
                                return ({
                                    code :responsecode.CODE_NULL,
                                    message:{keyword:"txt_token_error"},
                                    data:null,
                                    status:401
                                })
                              }
                    }else{
                        // invalid credentials
                        return ({
                            code :responsecode.UNAUTHORIZED,
                            message:{keyword:"txt_invalid_credentials"},
                            data:null,
                            status:401
                        })
                    }
                // }else{
                //     return ({
                //         code :responsecode.OPERATION_FAILED,
                //         message:{keyword:"txt_already_loggedin"},
                //         data:null,
                //         status:401
                //     })
                // }
                 }else{
                    // user deleted account signup again
                    return ({
                        code :responsecode.NOT_REGISTER,
                        message:{keyword:"txt_account_deleted"},
                        data:null,
                        status:401
                    })
                 }
              }else{//userblocked
                return ({
                    code :responsecode.INACTIVE_ACCOUNT,
                    message:{keyword:"txt_user_blocked"},
                    data:null,
                    status:401
                })
                }
        }else{
            // user not fount or signup required
            return ({
                code :responsecode.NOT_REGISTER,
                message:{keyword:"txt_user_not_registered"},
                data:null,
                status: 401
            })
        }


    }catch(error){
        console.log("user model error",error.message)
        return ({
            code :responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:data.message,
            status:500
        })
    }
}
async logout(userId){
    try {
       console.log("entered logout")
        let updatequery =`update tbl_user set is_login= 0 where id=?`
        let response  = await db.query(updatequery,userId)
        if(response.affectedRows!=0){
         let tokenresponse = await common.removeToken(userId)
         if(tokenresponse){
            console.log("logged out");
            
            return({
                code:responsecode.SUCCESS,
                message:{
                    keyword:"txt_logout_successfull"
                },
                data:null,
                status:200
            }
        )
         }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{
                    keyword:"txt_remove_token_error"
                },
                data:null,
                status:400
            })
         }
        }else{
            return({
                code:responsecode.OPERATION_FAILED,
                message:{
                    keyword:"txt_logout_failed"
                },
                data:null,
                status:400
            })
        }
    } catch (error) {
        console.log("server eror in model",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
        })
    }
}
async eventListing(){
    
    try {
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and is_approved=1`
       let [response] = await db.query(selectQuery);
       if(response){
        // console.log('response',response);
        
return({
    code:responsecode.SUCCESS,
    message:{keyword:"txt_events_fetched"},
    data:response,
    status:200
})

       }else{
        return({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"txt_events_not_found"},
            data:null,
            status:300
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
async displayEvent(eventId){
    try {
        // console.log("uuuuuuuuuuuuuuuuu",eventId);
        
        let selectQuery = `select * from tbl_event where is_active=1 and is_deleted=0 and id = ?`
       let [response] = await db.query(selectQuery,eventId.id);
       if(response){
        // console.log(response);
        
return({
    code:responsecode.SUCCESS,
    message:{keyword:"txt_event_fetched"},
    data:response[0],
    status:200
})

       }else{
        return({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"txt_event_not_found"},
            data:null,
            status:300
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
    }}

async featuredEvents(){
        try {
            let selectQuery = `select id,is_featured,event_title,category,start_time,city,description,location,registrations,cover_image from tbl_event where is_active=1 and is_deleted=0 and is_approved=1 and is_featured=1 order by start_time limit 10`
       let [response] = await db.query(selectQuery);
       if(response){
        // console.log('response',response);
        
return({
    code:responsecode.SUCCESS,
    message:{keyword:"txt_featured_events_fetched"},
    data:response,
    status:200
})

       }else{
        return({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"txt_featured_events_not_found"},
            data:null,
            status:300
        })
        } }catch (error) {
            console.log("modle error",error.message)
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
        })
        }
    }
    async getBookmarkStatus(event_id,user_id){
    try {
        // console.log(user_id);
        // console.log(event_id.event_id);
        
        
        let Selectquery = `select is_bookmarked from tbl_event_bookmark where event_id = ? and user_id=?`
        let [responsee]  = await db.query(Selectquery,[event_id.event_id,user_id]) 
        // console.log('res2',responsee);
        
        let response = responsee[0]
        // console.log('res',response);
        
       if(response){
        return ({
            code:responsecode.SUCCESS,
            message:{keyword:"staus found"},
            data: response ,
            status:200
        })
    }else{
        return ({
            code:responsecode.OPERATION_FAILED,
            message:{keyword:"staus not found"},
            data: null,
            status:200
        })
    }
    } catch (error) {
        return({
            code:responsecode.SERVER_ERROR,
            message:{keyword:"txt_server_error"},
            data:null,
            status:500
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
                message: { keyword: "txt_bookmarked_successfully" },
                data: rows[0] || { is_bookmarked: 1 },
                status: 200
            };
        } else {
            return {
                code: responsecode.OPERATION_FAILED,
                message: { keyword: "txt_bookmark_failed" },
                data: null,
                status: 402
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
}module.exports = new UserModel();