//
// file: Merchandise.js
// model: Merchandise
// 
// Simple set of key/value pairs that can be applied to an offer or
// benefit as a property list.  The dataType field specifies the type
// of data stored in the value field (plaintext, image, ect).
// The placement field is a hint about how the resource should be placed
// on the screen
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    name            : String,
    merchType       : {type: Number, ref: 'MerchType'},
    placement       : {type: Number, ref: 'Placement'},
    value           : String,
    binValue        : Buffer,
    notes           : String,
    offer           : {type: ObjectId, ref: 'Offer'},
    benefit         : {type: Number, ref: 'Benefit'}
});
 
module.exports = mongoose.model('Merchandise', postSchema);