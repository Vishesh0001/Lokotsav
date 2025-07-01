const express = require('express')
const bodyParser = require('body-parser')
const dotenv =require('dotenv')
const app_routing = require('./modules/app-routing')
// const validators = require('./middleware/validator')
// const path = require('path')
const cors = require('cors');
// const userModel = require('./modules/v1/user/models/user-model')
// const common = require('./utilities/common')
dotenv.config();
const app = express()
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests from Next.js frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'token','api-key'], // Allow custom 'token' header
    // credentials: true, // If cookies or auth headers are needed
  })
);

// // Middleware to handle preflight OPTIONS requests
// app.options('*', cors());
app.use(bodyParser.text());
app.use(bodyParser.json());
const port = process.env.PORT;
// app.use(validators.validateApiKey);
// app.use(validators.extractHeaderLanguage);
// app.use(validators.validateHeaderToken);

  app_routing.v1(app);



// common.getTaskDetail(8)
// userModel.blogList()
try {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} 
catch (error) {
  console.log("Error in server:" + error);
}