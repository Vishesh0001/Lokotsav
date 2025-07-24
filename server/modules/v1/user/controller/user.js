const userModel = require('../models/user-model')
const schema = require("../../../validationSchema")
const validateWithJoi = require("../../../../middleware/validator")
const common = require("../../../../utilities/common")
const responsecode = require("../../../../utilities/response-error-code")
class User{
async signUp(req, res) {
        try {
            const requestData = await common.decodeBody(req.body);
            
            const validationResponse = await validateWithJoi.checkValidation(requestData, schema.signUpSchema);
            if (validationResponse) {
                return common.sendResponse(req, res, validationResponse.code, validationResponse.message,validationResponse.data,400);
            }else{
      
            const response = await userModel.signup(requestData);
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);}
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
}
async login(req,res){
        try{
          console.log("entered login")
          // console.log(req.body)
          const requestData =await common.decodeBody(req.body);
          // console.log('decode body',requestData);
          // 
          const validationResponse = await validateWithJoi.checkValidation(requestData, schema.loginSchema);
          // console.log(validationResponse);
          
          if (validationResponse) {
              return common.sendResponse(req, res, validationResponse.code, validationResponse.message,validationResponse.data,400);
          }else{
            // console.log("12");
            
      
          const response = await userModel.login(requestData);
          console.log("response",response)
          return common.sendResponse(req, res, response.code, response.message, response.data,response.status);}
      
        }catch(error){
      console.log("login error",error.message)
      return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},500);
        }
}
async verifyOTP(req,res){
        try {
          const otp = await req.body
          const response = await userModel.verifyOTP(otp)
          res.send(response)
        } catch (error) {
             res.send({code:2,message:{keyword:'server error'},data:[]})
          
        }
}
async resendOTP(req,res){
  try {
    let user_id = req.body
    const resp = await userModel.resendOTP(user_id)
    res.send(resp)
  } catch (error) {
    console.log(error);
    
    res.send({code:2,message:{keyword:'server error'},data:[]})
  }
}
async logout(req,res){
        try {
          let userId = await common.getUserIdFromToken(req)
          if(userId==-1){
             return common.sendResponse(req,res,0,{keyword:"txt_user_not_found"},{},400)
          }else{
                 let response = await userModel.logout(userId)
                 return common.sendResponse(req,res,response.code,response.message,response.data,response.status)
          }
        } catch (error) {
          console.log("logout error",error.message)
      return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},500);
        }
}
 async deleteAccount(req,res){
    try {
      let request_data = await common.decodeBody(req.body)
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.deleteaccount(request_data,user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
 async forgotpassword(req,res){
      try {
      let request_data = await common.decodeBody(req.body)
  
    let response = await userModel.forgotpassword(request_data)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
  async verifycode(req,res){
      try {
      let request_data = await common.decodeBody(req.body)
  
    let response = await userModel.verifycode(request_data)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
   async resetpassword(req,res){
      try {
      let request_data = await common.decodeBody(req.body)
  
    let response = await userModel.resetPassword(request_data)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
async getEvents(req,res){
        try {
          let response = await userModel.eventListing()
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async getEvent(req,res){
        try {
          // console.log('req body ',req.body);
          
          let event_id = await common.decodeBody(req.body)
          console.log('event_id',event_id);
          
          let response = await userModel.displayEvent(event_id)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async getFeaturedEvents(req,res){
        
        try {
          let response = await userModel.featuredEvents()
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
      
}
async bookmark(req,res){
        try {
          let event_id = await common.decodeBody(req.body)
          // let event_id = req.body
          // console.log("searchtrerm",searchTerm);
          const user_id = await common.getUserIdFromToken(req)
          let response = await userModel.bookmark(event_id,user_id)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async getBookmarkStatus(req,res){
        try {
          // console.log('req body',req.body);
          
          let event_id = await common.decodeBody(req.body)
          // console.log('eventsss',event_id);
          
          // let event_id = req.body
          // console.log("searchtrerm",searchTerm);
          const user_id = await common.getUserIdFromToken(req)
          // console.log(user_id);
          
          let response = await userModel.getBookmarkStatus(event_id,user_id)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async createEvent(req,res){
    
        try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
            const user_id = await common.getUserIdFromToken(req)
            const validationResponse = await validateWithJoi.checkValidation(requestData, schema.event);
            if (validationResponse) {
                return common.sendResponse(req, res, validationResponse.code, validationResponse.message,validationResponse.data,400);
            }else{
      
            const response = await userModel.createEvent(requestData,user_id);
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);}
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
      
}
 async getBookmarkedEvents(req,res){
  try {
    // let event_id = await common.decodeBody(req.body)
    // let event_id = req.body
    // console.log("searchtrerm",searchTerm);
    // console.log("hellooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.getBookmarkedEvents(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
    
  }
 }
 async getsubmitted(req,res){
  try {
    // let event_id = await common.decodeBody(req.body)
    // let event_id = req.body
    // console.log("searchtrerm",searchTerm);
    // console.log("hellooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.getsubmitted(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
    
  }
 }
async searchEvent(req,res){
        try {
          let searchTerm = await common.decodeBody(req.body)
          // console.log("searchtrerm",searchTerm);
          
          let response = await userModel.searchEvent(searchTerm)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
}
async getApprovedEvents(req,res){
  try {
    // let event_id = await common.decodeBody(req.body)
    // let event_id = req.body
    // console.log("searchtrerm",searchTerm);
    // console.log("hellooooooooooooooooooooooooooooooooooooooooooooooooooooooo");
    
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.approvedEvents(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
    
  }
 }
 async getUnApprovedEvents(req,res){
   try {
      const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.UnapprovedEvents(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
    
  }
 }
 async getcategory(req,res){
        try {
          // console.log('req body ',req.body);
          
          let request_data = await common.decodeBody(req.body)
          // console.log('event_id',event_id);
          
          let response = await userModel.category(request_data)
          common.sendResponse(req,res,response.code,response.message,response.data,response.status)
        } catch (error) {
          console.log("controller eror",error.message)
          common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
          
        }
 }
 async getBookingStatus(req,res){
     try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
            const user_id = await common.getUserIdFromToken(req)
            const response = await userModel.checkBookingStatus(requestData,user_id);
            // console.log(response);
            
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
  async updateOrder(req,res){
     try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
         
            const response = await userModel.updateOrder(requestData);
            console.log(response);
            
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
 async placeOrder(req,res){
     try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
            const user_id = await common.getUserIdFromToken(req)
            const response = await userModel.createOrder(requestData,user_id);
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
  async getPaymentDetails(req,res){
     try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
            const user_id = await common.getUserIdFromToken(req)
            const response = await userModel.getPaymentDetails(requestData,user_id);
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
 async Payment(req,res){
  try {
      const request_data = await common.decodeBody(req.body);
      const response = await userModel.payment(request_data);
        return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
  } catch (error) {
         console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
  }

 }
async getUnFeaturedEvents(req,res){
  try {
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.getEventsForFeature(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
 async featureorder(req,res){
    try {
      let request_data = await common.decodeBody(req.body)
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.featureorder(request_data,user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
 async orderDetails(req,res){
      try {
  
    const user_id = await common.getUserIdFromToken(req)
    let response = await userModel.orderDetails(user_id)
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
 async trendingEvents(req,res){
        try {
    let response = await userModel.trendingEvents()
    common.sendResponse(req,res,response.code,response.message,response.data,response.status)
  } catch (error) {
    console.log("controller eror",error.message)
    common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
  }
 }
   async totalUsers(req,res){
     try {
            const response = await userModel.totalUser();
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
   async totalEvents(req,res){
     try {
            const response = await userModel.totalEvents();
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
   async totalfeaturedevents(req,res){
     try {
            const response = await userModel.totalFeaturedEvents();
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }
    async totalTicketssold(req,res){
     try {
            const response = await userModel.tottalticketssold();
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
 }


      }
    
    module.exports = new User();