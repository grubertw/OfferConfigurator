//
// file: Offer.js
// model: Offer
// 
// Model representing a product offer to the consumer.
// As product offers are sent to a population (segment), the population acts
// as the parent container of the offer.  This way, when offers are made to
// a population, they can done as a split, or within a grouping.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;

var Offer = new Schema({
    className                   : String,
    name                        : String,
    description                 : String,
    offerTypeId                 : ObjectId,
    split                       : Number,
    statusId                    : ObjectId,
    startTime                   : Date,
    stopTime                    : Date,
    paymentAuthorizationAmount  : String,
    shortPaymentDisclosure      : String,
    longPaymentDisclosure       : String,
    populationId                : ObjectId,
    
    // A list of benefitId(s) are stored here as an embedded structure
    // (rather than using a pivot-table, which is the only way to do
    // a many-to-many relationship with a SQL database).
    benefits                    : [{
        benefitId               : ObjectId
    }]
    
    // Charges/Terms are NOT embedded.  Instead, seporate instances
    // are created with an offerId.
});
 
module.exports = mongoose.model('Offer', Offer);