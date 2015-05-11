//
// file: ProrationRule.js
// model: ProrationRule
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id                         : Number,
    name                        : String
});
 
module.exports = mongoose.model('ProrationRule', postSchema);