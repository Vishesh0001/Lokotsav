
const responsecode = require("../utilities/response-error-code")

class Validator{

     async checkValidation(data,schema){
        // (data);
        
        const {error} = await schema.validate(data,{abortEarly:true}) // this wiill be giving first erroe that appears
       if(error){
   
        return{
          
            code: responsecode.OPERATION_FAILED,
            message: {keyword: error.details[0].message},
            data: null
        }
       }else{
        return false
       }
    }
}module.exports = new Validator()