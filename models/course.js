var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CourseSchema = new Schema({
    title: String,
    desc: String,
    wistiaId: String,       // video hosting platform 
    price: Number,
    ownByTeacher: { type: Schema.Types.ObjectId, ref: 'User' },
    ownByStudent: [{
        user: { type: Schema.Types.ObjectId, ref: 'User' },
    }],
    totalStudents: Number,
});

module.exports = mongoose.model('Course', CourseSchema);