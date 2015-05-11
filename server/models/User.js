//
// file: User.js
// model: User
// 
// Model representing a user that can authenticate and use the application.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    username                    : String,
    password                    : String,
    firstName                   : String,
    lastName                    : String
});
 
module.exports = mongoose.model('User', postSchema);