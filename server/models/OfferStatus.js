//
// file: OfferStatus.js
// model: OfferStatus
// 
// Model representing the status of an offer, i.e. Active,
// Inactive, Published, ect.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    enumId          : Number,
    className       : String,
    name            : String,
    nextAction      : String,
    nextStatus      : ObjectId
});
 
module.exports = mongoose.model('OfferStatus', postSchema);