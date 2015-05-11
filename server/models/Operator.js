//
// file: Operator.js
// model: Operator
// 
// Model representing the operator between two segment expressions.
// If the segment expression is a container for a full term (i.e. the left-hand
// being a dimension and right-hand beaing a range), then the operator 
// should be logical (i.e. AND, OR, NOT).  If the segment expression is 
// a dimension and it's left-hand is a range, then the operator should be
// an equality (i.e. =, !=).
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id             : Number,
    sign            : String
});
 
module.exports = mongoose.model('Operator', postSchema);