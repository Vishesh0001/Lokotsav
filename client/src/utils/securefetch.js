import Cookies from 'js-cookie';
import { encrypt, decrypt } from './crypto'; 
import { jwtVerify } from 'jose';
import axios from 'axios';

let apiKey = process.env.NEXT_PUBLIC_API_KEY || 'vishesh456'

const jwtsecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'vishesh456'
let  baseURL = 'http://localhost:5000/v1/user'
const secureFetch = async (url, data = {}, method = 'POST') => {
  try {
    
    let cookietoken = Cookies.get('token')
    // console.log(Cookies.get('token'));
    
    if(cookietoken !=undefined|| null || ''){
    const secret = new TextEncoder().encode(jwtsecret);
    const { payload } = await jwtVerify(cookietoken, secret);
    const { r } = payload;
    const role = r
    if(role=='admin'){
      baseURL = 'http://localhost:5000/v1/admin'
    }}
    let token;
    
 
    let encryptedApi = encrypt(apiKey)
    let encryptedToken = '';
    // console.log("data",data);
    if(url=='/login'|| url=='/signup'){
         token = ' '
    }else{
      token = cookietoken
      encryptedToken = encrypt(token)
    }
     
    console.log("encrypted token",encryptedToken);
    // console.log("encrypted api",encryptedApi)
    
    // console.log(`${baseURL}${url}`)
   const receivedData = JSON.stringify(data)

    const encryptedData = encrypt(receivedData);
// console.log("encrypted datA",encryptedData);
let reqOptions;

if (method === 'GET') {
  reqOptions = {
    method: 'GET',
    url: `${baseURL}${url}`,
    headers: {
      'Content-Type': 'application/json',
      'token': encryptedToken,
      'api-key': encryptedApi
    }
  };
} else {
  reqOptions = {
    method: method,
    url: `${baseURL}${url}`,
    headers: {
      'Content-Type': 'application/json',
 'token': encryptedToken,
      'api-key': encryptedApi
    },
    data: {
      data: encryptedData
    }
  };
}

//     return decryptedData;
const res = await axios(reqOptions);

const encryptedText = res.data;

const decryptedData = decrypt(encryptedText);
// console.log('dec',decryptedData);

// (Optional) If you expect JSON string
// const parsed = JSON.parse(decryptedData);
// const finalData= decryptedData.data
return decryptedData; 
  } catch (error) {
    console.log(' login error',error);
    console.log("login errroe dtaa",error.response.data)
    const encryptedText = error.response.data;

const decryptedData = decrypt(encryptedText);
console.log('dec data in login',decryptedData);

return decryptedData
    // console.error('Error in secureFetch:', error);
    // throw new Error('Error while making the secure API request');
  }
};

export default secureFetch;
