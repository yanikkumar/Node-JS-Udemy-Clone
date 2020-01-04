var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var mongoose = require('mongoose');
var ejs = require('ejs');
var engine = require('ejs-mate');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo')(session);
var flash = require('express-flash');

// initialize express function in variable
var app = express();

// requiring secret.js
var secret = require('./config/secret');

/*
// mongoose Full Driver Example usefull in node version >=3
const MongoClient = require('mongodb').MongoClient;
const uri = secret.database;
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
    if (!err) {
        console.log("Connected to DB");
    }
});
*/


// mongoDB connection string only (useful in node version <3)
mongoose.connect(secret.database, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Connected to DB");
    }
});

// middleware
app.use(express.static(__dirname + '/public'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: secret.secretKey,
    store: new MongoStore({ url: secret.database, autoReconnect: true }),
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(function (req, res, next) {
    res.locals.user = req.user;
    next();
});

// url testing
require('./routes/main')(app);
require('./routes/user')(app);
require('./routes/teacher')(app);
require('./routes/payment')(app);

// establishing Port
app.listen(secret.port, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Running on port " + secret.port);
    }
});