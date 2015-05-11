//
// file: PrivilegeType.js
// model: PrivilegeType
// 
// Model representing a supported privilege type of the application.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    name                        : String
});
 
module.exports = mongoose.model('PrivilegeType', postSchema);