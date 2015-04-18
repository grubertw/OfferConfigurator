//
// file: BillingOnset.js
// model: BillingOnset
// 
// Model indicating the billing onset of a charge within an offer.
// e.x. Trial Start, Membership Start, 3B3S Delivered.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id                         : Number,
    className                   : String,
    name                        : String
});
 
module.exports = mongoose.model('BillingOnset', postSchema);