//
// file: OfferType.js
// model: OfferType
// 
// Model representing the types of an offer, i.e. New Subscription,
// Transaction, Retention, ect.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    enumId          : Number,
    className       : String,
    name            : String
});
 
module.exports = mongoose.model('OfferType', postSchema);