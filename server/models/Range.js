//
// file: Range.js
// model: Range
// 
// Model representing the range of a segment population dimension.
// e.x. Ranges in the Occupation dimension would be: Engineer, Doctor,
// Lawyer, Accountant, ect...
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id             : Number,
    name            : String,
    dimension       : {type: Number, ref: 'Dimension'} // fKey
});
 
module.exports = mongoose.model('Range', postSchema);