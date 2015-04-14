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
    className                   : String,
    price                       : String,
    frequency                   : String,
    startDate                   : Date,         
    description                 : String,
    billingPeriod               : String,   // Same as Recurrence.name
    recurrence                  : {type: Number, ref: 'Recurrence'},
    timespan                    : Number,
    isTrial                     : Boolean,
    prorationRule               : {type: Number, ref: 'ProrationRule'},
});
 
module.exports = mongoose.model('Term', postSchema);