var Course = require('../models/course');
var User = require('../models/user');

var async = require('async');

module.exports = function (app) {

    app.get('/', function (req, res, next) {
        res.render('main/home');
    });

    app.get('/courses', function (req, res, next) {
        Course.find({}, function (err, courses) {
            res.render('courses/courses', { courses: courses });
        });
    });

    app.get('/courses/:id', function (req, res, next) {
        async.parallel([        // async.parallel used if second alternate function depend upon previous function value (as we are doing database operations simultaneously)
            function (callback) {

                Course.findOne({ _id: req.params.id })
                    .populate('ownByStudent.user')
                    .exec(function (err, foundCourse) {
                        callback(err, foundCourse);
                    })
            },

            //function if user has taken course
            function (callback) {
                User.findOne({ _id: req.user._id, 'coursesTaken.course': req.params.id })
                    .populate('coursesTaken.course')
                    .exec(function (err, foundUserCourse) {
                        callback(err, foundUserCourse);
                    });
            },

            //function if user has teach course
            function (callback) {
                User.findOne({ _id: req.user._id, 'coursesTeach.course': req.params.id })
                    .populate('coursesTeach.course')
                    .exec(function (err, foundUserCourse) {
                        callback(err, foundUserCourse);
                    });
            },
        ], function (err, results) {
            var course = results[0];        // belongs to first funtion
            var userCourse = results[1];        // belogns to second function
            var teacherCourse = results[21];        // belongs to third function
            if (userCourse === null && teacherCourse === null) {
                res.render('courses/courseDesc', { course: course });
            } else if (userCourse === null && teacherCourse != null) {
                res.render('courses/course', { course: course });
            } else {
                res.render('courses/course', { course: course });
            }
        });
    });
}