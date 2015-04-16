//
// file: Term.js
// model: Benefit
// 
// Terms of the offer (an offer usually has more than one of these)
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    name                        : String,
    className                   : String,
    price                       : String,
    msrp                        : String,
    isTrial                     : Boolean,
    startDate                   : Date,         
    description                 : String,
    billingOnset                : {type: Number, ref: 'BillingOnset'},
    frequency                   : String,
    billingPeriod               : String,
    hasBillingInterval          : Boolean,
    billingInterval             : {type: Number, ref: 'BillingInterval'}, // Every 'Month'
    recurrence                  : {type: Number, ref: 'Recurrence'}, // For '2' months.
    prorationRule               : {type: Number, ref: 'ProrationRule'},
    offer                       : {type: ObjectId, ref: 'Offer'}
});
 
module.exports = mongoose.model('Term', postSchema);