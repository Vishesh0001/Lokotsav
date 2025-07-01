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
          console.log('req body ',req.body);
          
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


      }
    
    module.exports = new User();