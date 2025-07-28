const express = require('express')
const dotenv =require('dotenv')
const app_routing = require('./modules/app-routing')
const cors = require('cors');
const { validateApiKey } = require('./middleware/header-validations');

dotenv.config();
const app = express()
app.use(express.text())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));


app.use(
  cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'token','api-key'], 
   
  })
);
app.get('/', (req, res) => {
  res.send("Backend is running.");
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(validateApiKey)

const port = process.env.PORT || 1000;
  app_routing.v1(app);
try {
  app.listen(port, () => {
  ;
  });
} 
catch (error) {
  ("Error in server:" + error);
}