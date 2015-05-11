//
// file: Dimension.js
// model: Dimension
// 
// Model representing the dimension of a segment population.
// e.x. Dimensions of a segment of a population: Age, Gender, Race,
// Occupation, ect....
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    _id             : Number,
    name            : String
});
 
module.exports = mongoose.model('Dimension', postSchema);