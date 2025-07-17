const joi = require("joi");



let  ValidationSchema={
 signUpSchema : 
 joi.object({
    username: joi.string().required(),
    email: joi.string().email().required().label('Email'),

    password: joi.string().min(3).max(30).required().label('Password'),
    confirmpassword: joi.string().required().label('confirmpassword')
             }),
 
loginSchema : joi.object({
   email: joi.string().email().label('Email'),

   password: joi.string().min(3).max(30).required().label('password'),
 }),   

 event:joi.object({
   // user_id: joi.number().required(), 
   event_title: joi.string().min(3).max(100).required(),
   start_time: joi.date().iso().required(),
   end_time: joi.date().iso().greater(joi.ref('start_time')).required(),
   city: joi.string().min(2).max(50).required(),
   category: joi.string().min(3).max(50).required(),
   description: joi.string().min(10).required(),
  
   tips: joi.string().allow('', null),
   cultural_significance: joi.string().allow('', null),
   location: joi.string().min(3).max(100).required()
 })

}
module.exports = ValidationSchema;