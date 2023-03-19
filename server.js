const express = require("express");
// const bodyParser = require("body-parser"); /* deprecated */
const cors = require("cors");
const https = require('https');
const http = require('http');
const fs = require('fs');
const { format } = require('date-fns');
const app = express();

var corsOptions = {
  origin: "*"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json({ limit: "5000mb" })); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: "5000mb", parameterLimit: 50000 })); /* bodyParser.urlencoded() is deprecated */

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to flight-dekho application." });
});
app.post("/register",  (req, res) => {
  const currentDate = new Date();
  const create_at = format(currentDate, 'yyyy-MM-dd');
  req.body['create_at'] = create_at
  const existingData = fs.readFileSync('./users.json');
  const existingObj = JSON.parse(existingData);
  existingObj.push(req.body);
  const updatedData = JSON.stringify(existingObj);
  fs.writeFileSync('./users.json', updatedData);
  res.json({
    status:200,
    message:'Users registered successfully.'
  })
});
app.get("/users", async (req,res) => {
  const existingData = fs.readFileSync('./users.json');
  const existingObj = await JSON.parse(existingData);
  res.json({
    data:existingObj,
    status:200,
    message:'Get all users successfully.'
  })
})
app.post("/book-flight-by-user",(req,res) => {
      const currentDate = new Date();
  const booked_at = format(currentDate, 'yyyy-MM-dd');
  req.body['booked_at'] = booked_at
 const existingData = fs.readFileSync('./booked-flights.json');
  const existingObj = JSON.parse(existingData);
  existingObj.push(req.body);
  const updatedData = JSON.stringify(existingObj);
  fs.writeFileSync('./booked-flights.json', updatedData);
  res.json({
    status:200,
    message:'Your flight booked successfully.'
  })
})
app.get("/booked-flights", async (req,res) => {
  const existingData = fs.readFileSync('./booked-flights.json');
  const existingObj = await JSON.parse(existingData);
  res.json({
    data:existingObj,
    status:200,
    message:'Get all booked-flights successfully.'
  })
})


http.createServer(app).listen(3000, () => {
  console.log(`Server is running on port 3000.`);
});
