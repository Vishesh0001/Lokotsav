const express = require('express')
const bodyParser = require('body-parser')
const dotenv =require('dotenv')
const app_routing = require('./modules/app-routing')

// const path = require('path')
const cors = require('cors');
const { validateApiKey } = require('./middleware/header-validations');

dotenv.config();
const app = express()
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));



app.use(
  cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'token','api-key'], 
   
  })
);
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(validateApiKey)

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
  ;
  });
} 
catch (error) {
  console.log("Error in server:" + error);
}