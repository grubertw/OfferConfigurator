//
// file: Privilege.js
// model: Privilege
// 
// Model representing a user privilege.  Each user may be assigned a set of
// privileges.  On login, the privileges of the user may be appended to the
// session object.  When a CRUD api route is accessed, the user is referenced
// from the sessionId.  The backend then checks the user's assigned privileges
// before alowing the operation to proceed.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    privilegeTypeId             : ObjectId,
    userId                      : ObjectId,
    readAccess                  : Boolean,
    createAccess                : Boolean,
    updateAccess                : Boolean,
    deleteAccess                : Boolean
});
 
module.exports = mongoose.model('Privilege', postSchema);