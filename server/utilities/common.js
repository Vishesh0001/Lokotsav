require('dotenv').config();
const jwt = require('jsonwebtoken');
const db = require("../config/database")
const crypto = require('crypto');

const key = Buffer.from(process.env.HASH_KEY, 'hex');
const iv = Buffer.from(process.env.HASH_IV, 'hex');

class Common{ 
  encrypt(data) {
    try {
      if (!data) return null;
      const dataStr = typeof data === 'object' ? JSON.stringify(data) : data;
      const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
      let encrypted = cipher.update(dataStr, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      return encrypted;
    } catch (err) {
      console.error('Encryption error:', err);
      return null;
    }
  }
  
 async decrypt(data) {
    try {
      // console.log('data',data)
      // console.log('key',key);
      // console.log('iv',iv);
      
      
      if (!data) return {};
      const decipher =  crypto.createDecipheriv('aes-256-cbc', key, iv);
      // console.log("decipher",decipher)
      let decrypted = decipher.update(data, 'hex', 'utf8');
      // console.log("dec",decrypted);
      
      decrypted += decipher.final('utf8');
      // console.log("dec",decrypted);
      try {
        let data = await JSON.parse(decrypted);
        return data
      } catch {
        return decrypted;
      }
    } catch (err) {
      console.error('Decryption error:', err);
      return {};
    }
  }
  generateToken (Id, r) {
    return jwt.sign(
      { id: Id, r },
      process.env.JWT_SECRET || 'vishesh456',
      { expiresIn: '1d' }
    );
  }
  async storeToken(userId,token){
    const query = `
    INSERT INTO tbl_device (user_id, user_token)
    VALUES (?, ?)
  `;
  try {
    let [response]= await db.query(query, [userId, token]);
    // console.log(response)
    if(response.affectedRows==0){
        return false
    }else {return true}
  } catch (error) {
    // throw new Error('Token storage failed: ' + error.message);
    console.log(error.message)
    return false;
  }
}
async updateLoginFlag(userId){
  try {
    let updatequery = `update tbl_user set is_login = 1 where id= ?`
    let [response] = await db.query(updatequery,userId)
    if(response.affectedRows==0){
      throw new Error('updation error'); 
    }else{return;}
  } catch (error) {
    throw error
  }
}
  async decodeBody(Adata){
    // console.log(Adata);
    let responseData = Adata.data
    // console.log(responseData);
    
    // let dataa = await data.data.json()
    let decryptedData = await this.decrypt(responseData);
    // console.log("decreptted data in decode boduy",decryptedData);
    
    return decryptedData;
    // return data
  }

  sendResponse(req,res,code,message,data,status){
    let dataa ={
      code:code,
      message:message,
      data:data
    }
    let encryptedData = this.encrypt(dataa)
res.status(status).send(encryptedData)
  }

 async checkEmail(email){
    try {
        let sql = "SELECT id FROM tbl_user WHERE email = ? AND is_active = 1 AND is_deleted = 0";
        const [results] = await db.query(sql, [email]);
        if(results.length > 0){
            return true;
        } else{
            return false;
        }
    } catch (error) {
        throw error;
    }
  }

  async checkPhone(mobile_number) {
    try {
        let sql = "SELECT id FROM tbl_user WHERE phone = ? AND is_active = 1 AND is_deleted = 0 ";
        const [results] = await db.query(sql, [mobile_number]);
        if(results.length >  0){
            return true;
        } else{
            return false;
        }
    } catch (error) {
        throw error;
    }
}
async removeToken(userId){
try{ 
  let updateQuery = `update tbl_device set is_active=0,is_deleted =1 where user_id = ?`
  let [response] = await db.query(updateQuery,userId)
  if(response.affectedRows==0){
    return false 
  }else {return true}

}
catch(error){
console.log("error while removing token",error.message)
return false
}
}
async  getUserIdFromToken(req) {
  // console.log(req);
  
  const token = await req.headers['token'];
  // console.log("token",token);
  
  const user_token = await this.decrypt(token)
// let user_token =  await this.decodeBody(token)
// console.log("decpt token",decryptedToken);
// console.log("dec token",user_token);

// console.log(user_token)
  if (user_token==undefined) {
    console.log("cannot find token");
    
      return -1;
  }else{

  const query = `SELECT user_id FROM tbl_device WHERE user_token = ? and is_active=1 and is_deleted = 0 `;

  try {
      const resultt = await db.query(query, user_token);
      let result = resultt[0]
      // console.log(result);
      
      if (result.length == 0) {
        console.log("caonnot find id")
          return -1;
      }else{
      return  result[0].user_id;}
  } catch (err) {
      console.error("Database Error:", err);
      return -1;
  }}
}
async getBookmarkStatus(event_id){
    
}

}
module.exports = new Common();