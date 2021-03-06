//
// file: Benefit.js
// model: Benefit
// 
// A consumer benefit/comodity, i.e. 1B Report, 3M Monitoring.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id             : Number,
    name            : String,
    description     : String
});
 
module.exports = mongoose.model('Benefit', postSchema);