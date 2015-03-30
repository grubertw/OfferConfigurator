//
// file: Recurrence.js
// model: Recurrence
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    className                   : String,
    name                        : String
});
 
module.exports = mongoose.model('Recurrence', postSchema);