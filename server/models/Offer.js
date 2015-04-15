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
    offerType                   : {type: Number, ref: 'OfferType'},
    split                       : Number,
    offerStatus                 : {type: Number, ref: 'OfferStatus'},
    startDate                   : Date,
    endDate                     : Date,
    requiresPaymentAuthorization: Boolean,
    paymentAuthorizationAmount  : String,
    shortPaymentDisclosure      : String,
    longPaymentDisclosure       : String,
    population                  : {type: ObjectId, ref: 'Population'},
    
    // Reference each benefit as a sub-document reference.
    // Offer.list() or Offer.show() is called, the REST handler will 
    // invoke populate() to fill these in.
    benefits                    : [{type: Number, ref: 'Benefit'}],
    terms                       : [{type: ObjectId, ref: 'Term'}]
});
 
module.exports = mongoose.model('Offer', Offer);