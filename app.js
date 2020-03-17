const express = require('express');
const path = require('path');
const cors = require('cors');

const moment = require('moment');
const ejs = require('ejs');
const dotenv = require('dotenv').config();
const app = express();
const mongoose = require('mongoose')
app.set('view engine','ejs');


// Mongoose/MongoDB Connection 

// Set up a pending connection to the database
// See: https://mongoosejs.com/docs/
const dbURI = process.env.MONGODB_URL;
mongoose.connect(dbURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
});

// Connect to database. Mongoose handles the asynchronous aspects internally so we don't have to.
var db = mongoose.connection;

// Set a callback in case there's an error.
db.on('error', function(error){
  console.log(`Connection Error: ${error.message}`)
});
// Set a callback to let us know we're successfully connected
db.once('open', function() {
  console.log('Connected to DB...');
});


// cors origin URL - Allow inbound traffic from origin
corsOptions = {
  origin: "https://express-assn3.herokuapp.com/gallery",
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));


app.use(express.urlencoded({ extended: false }));

app.use(function(req, res, next) {
  res.locals.year=moment().format('YYYY');
  
    next();
  });
  
app.get('/',function(req, res) {  
  res.render('index',{title: 'Home'});
});

app.get('/services',function(req, res) {  
  res.render('services',{title:'Services'});
});
const Definition = require('./models/Definition.js');

app.get('/gallery',function(req, res) {  
  
  Definition.find(function(error, result) { 

    app.locals.gallery=result;
    res.render('gallery',{title:'Gallery'});

  });
});

app.get('/gallery/:id',function(req, res, next) {
  
  Definition.findOne({id: req.params.id},function(error, result) { 
 
    app.locals.gallery=result;
    res.render('gallery-id',{title:`${req.params.id}`});

});
});

app.get('/contact',function(req, res) {  
    res.render('contact',{title:'Contact'});
  });

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.status(404);
  res.send('404: File Not Found');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
  console.log(`Listening on port ${PORT}`);
});
