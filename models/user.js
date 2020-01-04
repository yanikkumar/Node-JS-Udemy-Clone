var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    /*
    Included things:-
    email,
    profile, name, picture,
    courses that the user is teaching,
    courses that the user is taking,
    Not taking password because we use facebook data authentication
    */
    email: { type: String, unique: true, lowercase: true },
    facebook: String,
    tokens: Array,
    role: String,
    profile: {
        name: { type: String, default: '' },
        picture: { type: String, default: '' }
    },

    coursesTeach: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' }       // object id is only 
    }],
    coursesTaken: [{
        course: { type: Schema.Types.ObjectId, ref: 'Course' }
    }],
    revenue: [{
        money: Number
    }]

});

module.exports = mongoose.model('User', UserSchema);

