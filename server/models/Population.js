//
// file: Population.js
// model: Population
// 
// Model representing a consumer population, or more specificly,
// a segment of a population.  A population is used for conifiguting
// who an offer is presented.  An offer may be presented to more than
// one population.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    className                   : String,
    name                        : String,
    statusId                    : ObjectId
});
 
module.exports = mongoose.model('Population', postSchema);