var User = require('../models/user');
var Course = require('../models/course');
var stripe = require('stripe')('sk_test_ed9U2hPwQtHZxC333vJchNgq');
var async = require('async');

module.exports = function (app) {

    // getting stripe token (which is hidden in stripe JS)
    app.post('/payment', function (req, res, next) {
        var stripeToken = req.body.stripeToken;
        var courseId = req.body.courseId;

        async.waterfall([
            function (callback) {
                Course.findOne({ _id: courseId }, function (err, foundCourse) {
                    if (foundCourse) {
                        callback(err, foundCourse);
                    }
                });
            },
            function (foundCourse, callback) {       // creating customer
                stripe.customers.create({
                    source: stripeToken,
                    email: req.user.email
                }).then(function (customer) {       // creating charges
                    return stripe.charges.create({
                        amount: foundCourse.price,
                        currency: 'usd',
                        customer: customer.id
                    }).then(function (charge) {     // updating collections so using async.parallel
                        async.parallel([
                            function (callback) {
                                Course.update({
                                    _id: courseId,
                                    'ownByStudent.user': { $ne: req.user._id }
                                },
                                    {
                                        $push: { ownByStudent: { user: req.user._id } },
                                        $inc: { totalStudents: 1 }
                                    }, function (err, count) {
                                        if (err) return next(err);
                                        callback(err);
                                    });
                            },
                            function (callback) {
                                User.update(        // same logic to users update
                                    {
                                        _id: req.user._id,
                                        'coursesTaken.course': { $ne: courseId }
                                    },
                                    {
                                        $push: { coursesTaken: { course: courseId } },
                                    }, function (err, count) {
                                        if (err) return next(err);
                                        callback(err);
                                    });
                            },
                            function (callback) {
                                User.update(        // updating revenue
                                    {
                                        _id: foundCourse.ownByTeacher
                                    },
                                    {
                                        $push: { revenue: { money: foundCourse.price } },
                                    },
                                    function (err, count) {
                                        if (err) return next(err);
                                        callback(err);
                                    });
                            }
                        ], function (err, results) {        //  redirecting to courses to watch
                            if (err) return next(err);
                            res.redirect('/courses/' + courseId);
                        });
                    });
                });
            }
        ]);
    });

}