//
// file: ActionType.js
// model: ActionType
// 
// A type of action that may be applied to any model when the
// state of that model changes
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    enumId          : Number,
    className       : String,
    name            : String
});
 
module.exports = mongoose.model('ActionType', postSchema);