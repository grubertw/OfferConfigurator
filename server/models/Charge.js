//
// file: Charge.js
// model: Charge
// 
// Model representing how an offer will be charged.  An offer may have more than
// one charge.  If there are two charges, the timespan indicates the length of time
// the charge applies.  Timespans are serial (only one charge may be in effect at 
// a time).  Timespans are relitive (based on the offer's startTime).
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    className                   : String,
    name                        : String,
    orderWithinOffer            : Number,
    amount                      : String,
    msrp                        : String,
    billingOnsetId              : ObjectId,
    recurrenceId                : ObjectId,
    prorationRuleId             : ObjectId,
    timespan                    : Number,
    isTrial                     : Boolean,
    offerId                     : ObjectId
});
 
module.exports = mongoose.model('Charge', postSchema);