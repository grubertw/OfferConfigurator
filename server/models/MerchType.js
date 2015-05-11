//
// file: MerchType.js
// model: MerchType
// 
// Model representing the types of an offer, i.e. New Subscription,
// Transaction, Retention, ect.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id             : Number,
    name            : String,
    dataCode        : Number
});
 
module.exports = mongoose.model('MerchType', postSchema);