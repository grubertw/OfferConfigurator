//
// file: Session.js
// model: Session
// 
// Model representing a user session.  A session is granted to the user after 
// successfull authentication.  Any CRUD opperation with the backend requires
// a valid sessionId.  Session validity may expire after an interval of 
// inactivity.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    className                   : String,
    timeoutInterval             : Number, // time (in seconds) the session will expire.
    userId                      : ObjectId
});
 
module.exports = mongoose.model('Session', postSchema);