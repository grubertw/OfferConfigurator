//
// file: Placement.js
// model: Placement
//
// Enumerates placement of merchendising.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id                         : Number,
    name                        : String
});
 
module.exports = mongoose.model('Placement', postSchema);