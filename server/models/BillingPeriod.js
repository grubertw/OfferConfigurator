//
// file: BillingPeriod.js
// model: BillingPeriod
//
// Limits number of BillingInterval(s).  1, 2, 3, Indefinite.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id                         : Number,
    name                        : String
});
 
module.exports = mongoose.model('BillingPeriod', postSchema);