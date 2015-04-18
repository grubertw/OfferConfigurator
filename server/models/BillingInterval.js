//
// file: BillingInterval.js
// model: BillingInterval
// ex. Daily, Weekly, Monthly.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id                         : Number,
    className                   : String,
    name                        : String
});
 
module.exports = mongoose.model('BillingInterval', postSchema);