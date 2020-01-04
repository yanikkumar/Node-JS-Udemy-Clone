/* 
passport authenticate user
facebookstrategy authenticate user with facebook extension of normal passport lib
config is for getting data obj of fb that holds secret etc.
*/

var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var secret = require('../config/secret');

var async = require('async');       // for async function
var request = require('request');   // for requesting API from mail chimp


var User = require('../models/user');

// initialize User to store user id from session

passport.serializeUser(function (user, done) {
    done(null, user._id);
});

// desirialize User

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// passport strategy | a middleware for passport

passport.use(new FacebookStrategy(secret.facebook, function (req, token, refreshToken, profile, done) {
    User.findOne({ facebook: profile.id }, function (err, user) {
        if (err) return done(err);

        if (user) {
            req.flash('loginMessage', 'Successfully Login with Facebook');
            return done(null, user);
        } else {
            async.waterfall([
                function (callback) {
                    var newUser = new User();
                    newUser.email = profile._json.email;
                    newUser.facebook = profile.id;
                    newUser.tokens.push({ kind: 'facebook', token: token });
                    newUser.profile.name = profile.displayName;
                    newUser.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=square';

                    newUser.save(function (err) {
                        if (err) throw err;
                        req.flash('loginMessage', 'Successfully login with facebook');
                        callback(err, newUser)
                    });
                },

                function (newUser, callback) {
                    // mailchimp request
                    request({
                        url: 'https://us20.api.mailchimp.com/3.0/dba993e729/members',
                        method: 'POST',
                        headers: {
                            'Authorization': 'randomUser 87a5095ab205ec6e86ef8f098312cb66-us20',
                            'Content-Type': 'Application/json'
                        },
                        json: {
                            'email_address': newUser.email,
                            'status': 'subscribed'
                        }
                    }, function (err, response, body) {
                        // Do something
                        if (err) {
                            return done(err, newUser);
                        } else {
                            console.log("Success");
                            return done(null, newUser);
                        }
                    });
                }
            ]);
        }
    });
}));