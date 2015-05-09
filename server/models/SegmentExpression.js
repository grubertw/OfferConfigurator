//
// file: SegmentExpression.js
// model: SegmentExpression
// 
// Model representing the segment expression of a population.  An expression
// may be one of three base classes: Dimension, Operator, or Range.  If none of 
// these three, then it is a SegmentExpression, which has three components: a
// left-hand side, an operator, and a right-hand side.  In this way, the segment
// expression object tree may be made arbitraily complex, where order of operations
// is dictated by how the espressions are layed-out within the object heirarchy.
// the layer attribute is used for building this hierarchy, where layer 1 are the 
// base objects (i.e. Dimension, Operator, Range).  If a SegmentExpression is 
// marked layer 1, then it's left and right are Dimension and Range, NOT 
// SegmentExpression.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    className       : String,
    population      : {type: ObjectId, ref:'Population'},
    left            : {type: Number, ref:'Dimension'}, // fKey
    leftEx          : {type: ObjectId, ref:'SegmentExpression'},
    operator        : {type: Number, ref:'Operator'}, // fKey
    right           : {type: ObjectId, ref:'Range'}, // fKey
    rightEx         : {type: ObjectId, ref:'SegmentExpression'}
});
 
module.exports = mongoose.model('SegmentExpression', postSchema);