const adminModel = require('../models/admin-model')
const schema = require("../../../validationSchema")
const validateWithJoi = require("../../../../middleware/validator")
const common = require("../../../../utilities/common")
const responsecode = require("../../../../utilities/response-error-code")
class Admin{

async createEvent(req,res){
    
        try {
            // (req.body);
            
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
async deleteEvent(req,res){
    try {
    //   const requestData = req.body
      const requestData =await common.decodeBody(req.body);
      const response = await adminModel.deleteEvent(requestData);
  
      return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
  
  
    } catch (error) {
      ("deletion error",error.message)
  return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},500);
    }
  
}
async approveEvent(req,res){
    try {
    //   const requestData = req.body
      const requestData =await common.decodeBody(req.body);

        // (requestD/ata);
        
  
      const response = await adminModel.approveEvent(requestData);
  
      return common.sendResponse(req, res, response.code, response.message, response.data,response.status);
  
  
    } catch (error) {
      ("deletion error",error.message)
  return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {},500);
    }
  
}
async userList(req,res){
    try {
        // let product_id = await common.decodeBody(req.body)
        // ();
        
        let response = await adminModel.userList()
        common.sendResponse(req,res,response.code,response.message,response.data,response.status)
      } catch (error) {
        ("controller eror",error.message)
        common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
        
      }
}

async blockUser(req, res) {
  try {
    const requestData = await common.decodeBody(req.body);
    const response = await adminModel.blockUser(requestData);
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  } catch (error) {
    ("block user error:", error.message);
    return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {}, 500);
  }
}


async deleteUser(req, res) {
  try {
    const requestData = await common.decodeBody(req.body);
    const response = await adminModel.deleteUser(requestData);
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  } catch (error) {
    ("delete user error:", error.message);
    return common.sendResponse(req, res, responsecode.UNAUTHORIZED, { keyword: "Something_went_wrong" }, {}, 500);
  }
}

async unapprovedlist(req,res){
    try {
     
        // ('hellooooooooooo');
        
        let response = await adminModel.unapprovedEvents()
        common.sendResponse(req,res,response.code,response.message,response.data,response.status)
      } catch (error) {
        ("controller eror",error.message)
        common.sendResponse(req,res,responsecode.SERVER_ERROR,{keyword:"txt_server_error"},{},500)
        
      }
}
async getEventById(req, res) {
  try {
    const requestData = await common.decodeBody(req.body);
    const response = await adminModel.getEventById(requestData);
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  } catch (error) {
    ('controller error', error.message);
    return common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: 'txt_server_error' }, null, 500);
  }
}

async updateEvent(req, res) {
  try {
    const requestData = await common.decodeBody(req.body);
    const response = await adminModel.updateEvent(requestData);
    return common.sendResponse(req, res, response.code, response.message, response.data, response.status);
  } catch (error) {
    ('controller error', error.message);
    return common.sendResponse(req, res, responsecode.SERVER_ERROR, { keyword: 'txt_server_error' }, null, 500);
  }
}
}module.exports = new Admin()