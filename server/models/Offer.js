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
 
var postSchema = new Schema({
    className                   : String,
    name                        : String,
    offerTypeId                 : ObjectId,
    split                       : Number,
    statusId                    : ObjectId,
    startTime                   : Date,
    stopTime                    : Date,
    paymentAuthorizationAmount  : String,
    shortPaymentDisclosure      : String,
    longPaymentDisclosure       : String,
    populationId                : ObjectId
});
 
module.exports = mongoose.model('Offer', postSchema);