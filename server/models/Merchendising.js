//
// file: Merchendising.js
// model: Merchendising
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
    className       : String,
    name            : String,
    dataType        : String,
    placementHint   : String,
    value           : String,
    notes           : String,
    offerId         : ObjectId,
    benefitId       : ObjectId
});
 
module.exports = mongoose.model('Merchendising', postSchema);