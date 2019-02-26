const express = require('express');
const fs = require('fs');
const app = express();
const mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var jwt = require('jsonwebtoken');
var Async = require('async')
var _ = require('underscore')
const fileUpload = require('express-fileupload');
var https = require('https');
var authenticate = require('./routes/authenticate.js');

app.use(bodyParser.json({
    limit: "50mb"
}));


mongoose.Promise = global.Promise;
var url='mongodb://localhost:27017/Authentication';
mongoose.connect(url, {
    useNewUrlParser: true,
    useFindAndModify:false
}).then(() => {
    console.log("Successfully connected to the database");
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...', err);
    process.exit();
});


app.use(fileUpload({
        // useTempFiles: false,
        tempFileDir: process.cwd(),
        preserveExtension:4,
        safeFileNames: true
      }));




// app.use(logger('dev'));
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());



//route
app.use('/api/v1.0/authenticate',authenticate);



//create Server
// https.createServer({
//   key: fs.readFileSync('server.key'),
//   cert: fs.readFileSync('server.cert')
// }, app).listen(4012, () => {
//   console.log('Listening........')
// })

app.listen(8000, () => console.log('App listening on port 8000!'))


module.exports = app;
