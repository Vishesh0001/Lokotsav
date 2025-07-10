const adminModel = require('../models/admin-model')
const schema = require("../../../validationSchema")
const validateWithJoi = require("../../../../middleware/validator")
const common = require("../../../../utilities/common")
const responsecode = require("../../../../utilities/response-error-code")
class Admin{

async createEvent(req,res){
    
        try {
            // console.log(req.body);
            
            const requestData = await common.decodeBody(req.body);
            const user_id = await common.getUserIdFromToken(req)
            const validationResponse = await validateWithJoi.checkValidation(requestData, schema.event);
            if (validationResponse) {
                return common.sendResponse(req, res, validationResponse.code, validationResponse.message,validationResponse.data,400);
            }else{
      
            const response = await adminModel.createEvent(requestData,user_id);
            return common.sendResponse(req, res, response.code, response.message, response.data,response.status);}
        }catch (error) {
            console.error("Signup Error:", error);
            return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},401);
        }
      
}
async deleteProduct(req,res){
    try {
    //   const requestData = req.body
      const requestData =await common.decodeBody(req.body);
    //   console.log(requestData);
    //   console.log({requestData});
      
    //   const id = requestData
    //   const validationResponse = await validateWithJoi.checkValidation({id}, schema.deleteSchema);
      // console.log(validationResponse);
    //   
    //   if (validationResponse) {
        //   return common.sendResponse(req, res, validationResponse.code, validationResponse.message,validationResponse.data,400);
    //   }else{
        // console.log("12");
        
  
      const response = await adminModel.deleteEvent(requestData);
    //   console.log("response",response)
      return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
  
  
    } catch (error) {
      console.log("deletion error",error.message)
  return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},500);
    }
  
}
async userList(req,res){
    try {
        // let product_id = await common.decodeBody(req.body)
        // console.log();
        
        let response = await adminModel.userList()
        common.sendResponse(req,res,response.code,response.message,response.data,response.status)
      } catch (error) {
        console.log("controller eror",error.message)
        common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
        
      }
}
async unapprovedlist(req,res){
    try {
     
        
        let response = await adminModel.unapprovedEvents()
        common.sendResponse(req,res,response.code,response.message,response.data,response.status)
      } catch (error) {
        console.log("controller eror",error.message)
        common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
        
      }
}
}module.exports = new Admin()