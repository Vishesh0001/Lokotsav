import Cookies from 'js-cookie';
import { encrypt, decrypt } from './crypto';
import { jwtVerify } from 'jose';
import axios from 'axios';

const apiKey = process.env.NEXT_PUBLIC_API_KEY || 'vishesh456';
const jwtSecret = process.env.NEXT_PUBLIC_JWT_SECRET || 'vishesh456';
const userBaseURL = 'http://localhost:5000/v1/user';
const adminBaseURL = 'http://localhost:5000/v1/admin';
const validStatusCodes = [200, 201, 400,401, 403, 404, 409, 410, 500];
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
      if (role == 'admin' || isAdminRoute) {
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

    // console.log('encrypted token', encryptedToken);

    const receivedData = JSON.stringify(data);
    // console.log(receivedData);
    
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
        validateStatus: (status) => validStatusCodes.includes(status),
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
        validateStatus: (status) => validStatusCodes.includes(status),
      };
    }

    console.log('reqOptions', reqOptions);

    const res = await axios(reqOptions);
    if(!res.data){
      console.log('res.data nto found',res)
      throw new Error('No data returned from the server')
    }
    const encryptedText = res.data;

if (!encryptedText || typeof encryptedText !== 'string') {
  throw new Error('Invalid encrypted response from the server');
}

let decryptedData;
try {
  decryptedData = decrypt(encryptedText); // returns a JSON string
 
} catch (err) {
  console.error('Failed to decrypt/parse response', err);
  throw new Error('Failed to decrypt response');
}

return decryptedData;
  } catch (error) {
    console.error('Error in secureFetch:', error);
   const encryptedText = error.response?.data;

if (encryptedText && typeof encryptedText === 'string') {
  try {
    let decryptedData = decrypt(encryptedText);
    decryptedData = JSON.parse(decryptedData);
    return decryptedData;
  } catch (err) {
    console.error('Failed to decrypt/parse error response', err);
    throw new Error('Failed to decrypt error response');
  }
}

throw new Error('Error while making the secure API request');
  }
};

export default secureFetch;




