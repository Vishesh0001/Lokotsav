// import Cookies from 'js-cookie';
// import { encrypt, decrypt } from './crypto'; 
// import { jwtVerify } from 'jose';
// import axios from 'axios';

// let apiKey = process.env.NEXT_PUBLIC_API_KEY || 'vishesh456'

// const jwtsecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'vishesh456'
// let  baseURL = 'http://localhost:5000/v1/user'
// const secureFetch = async (url, data = {}, method = 'POST') => {
//   try {
    
//     let cookietoken = Cookies.get('token')
//     // console.log(Cookies.get('token'));
    
//  if (cookietoken !== undefined && cookietoken !== null && cookietoken !== '') {
//   const secret = new TextEncoder().encode(jwtsecret);
//   const { payload } = await jwtVerify(cookietoken, secret);
//   const { r } = payload;
//   const role = r;
//      // Use admin base only for admin routes
//      console.log('role',role);
//   const adminOnlyRoutes = ['/unapproved-events', '/approve-event', '/delete-event'];

//   if (role == 'admin' || adminOnlyRoutes.includes(url)) {
//     baseURL = 'http://localhost:5000/v1/admin';
//     }}
//     let token;
    
 
//     let encryptedApi = encrypt(apiKey)
//     let encryptedToken = '';
//     // console.log("data",data);
//     if(url=='/login'|| url=='/signup'){
//          token = ' '
//     }else{
//       token = cookietoken
//       encryptedToken = encrypt(token)
//     }
     
//     console.log("encrypted token",encryptedToken);
//     // console.log("encrypted api",encryptedApi)
    
//     // console.log(`${baseURL}${url}`)
//    const receivedData = JSON.stringify(data)

//     const encryptedData = encrypt(receivedData);
// // console.log("encrypted datA",encryptedData);
// let reqOptions;

// if (method === 'GET') {
//   reqOptions = {
//     method: 'GET',
//     url: `${baseURL}${url}`,
//     headers: {
//       'Content-Type': 'application/json',
//       'token': encryptedToken,
//       'api-key': encryptedApi
//     }
//   };
// } else {
//   reqOptions = {
//     method: method,
//     url: `${baseURL}${url}`,
//     headers: {
//       'Content-Type': 'application/json',
//  'token': encryptedToken,
//       'api-key': encryptedApi
//     },
//     data: {
//       data: encryptedData
//     }
//   };
// }
// console.log('123',reqOptions)

// //     return decryptedData;
// const res = await axios(reqOptions);

// const encryptedText = res.data;

// const decryptedData = decrypt(encryptedText);
// // console.log('dec',decryptedData);

// // (Optional) If you expect JSON string
// // const parsed = JSON.parse(decryptedData);
// // const finalData= decryptedData.data
// return decryptedData; 
//   } catch (error) {
//     // console.log(' login error',error);
//     // console.log("login errroe dtaa",error.response.data)
//     const encryptedText = error.response.data;

// const decryptedData = decrypt(encryptedText);
// console.log('dec data in login',decryptedData);

// return decryptedData
//     // console.error('Error in secureFetch:', error);
//     // throw new Error('Error while making the secure API request');
//   }
// };

// export default secureFetch;
import Cookies from 'js-cookie';
import { encrypt, decrypt } from './crypto';
import { jwtVerify } from 'jose';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'vishesh456';
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'vishesh456';
const userBaseURL = 'http://localhost:5000/v1/user';
const adminBaseURL = 'http://localhost:5000/v1/admin';

const secureFetch = async (url, data = {}, method = 'POST', isAdminRoute = false) => {
  try {
    let baseURL = userBaseURL; // Default to user base URL
    let cookietoken = Cookies.get('token');

    if (cookietoken !== undefined && cookietoken !== null && cookietoken !== '') {
      const secret = new TextEncoder().encode(jwtSecret);
      const { payload } = await jwtVerify(cookietoken, secret);
      const { r } = payload;
      const role = r;
      console.log('role', role);

      // Set baseURL to admin if the user is an admin and the route is admin-specific
      if (role === 'admin' && isAdminRoute) {
        baseURL = adminBaseURL;
      }
    }

    let token;
    let encryptedApi = encrypt(apiKey);
    let encryptedToken = '';

    if (url === '/login' || url === '/signup') {
      token = ' ';
    } else {
      token = cookietoken;
      encryptedToken = encrypt(token);
    }

    console.log('encrypted token', encryptedToken);

    const receivedData = JSON.stringify(data);
    const encryptedData = encrypt(receivedData);

    let reqOptions;

    if (method === 'GET') {
      reqOptions = {
        method: 'GET',
        url: `${baseURL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          'token': encryptedToken,
          'api-key': encryptedApi,
        },
      };
    } else {
      reqOptions = {
        method: method,
        url: `${baseURL}${url}`,
        headers: {
          'Content-Type': 'application/json',
          'token': encryptedToken,
          'api-key': encryptedApi,
        },
        data: {
          data: encryptedData,
        },
      };
    }

    console.log('reqOptions', reqOptions);

    const res = await axios(reqOptions);
    const encryptedText = res.data;
    const decryptedData = decrypt(encryptedText);

    return decryptedData;
  } catch (error) {
    console.error('Error in secureFetch:', error);
    const encryptedText = error.response?.data;

    if (encryptedText) {
      const decryptedData = decrypt(encryptedText);
      console.log('dec data in error', decryptedData);
      return decryptedData;
    }

    throw new Error('Error while making the secure API request');
  }
};

export default secureFetch;