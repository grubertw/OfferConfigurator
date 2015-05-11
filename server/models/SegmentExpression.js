//
// file: SegmentExpression.js
// model: SegmentExpression
// 
// Used to define a population segment.  Stored as an array within the population.
// If the expression is marked operator only, it is an outer operator, and does not
// have a left and right argument (meaning it is either AND, OR, or NOT, joining a 
// pair of expressions).  If operatorOnly is false, then the left arg is a dimension
// and the right arg is a range within that dimension.  In this case, the operator
// should be = or !=.
//
// For added complexity (as if this wasn't complex enough!), leftEx and rightEx may 
// be set to expression objects.  If this is the case, once again, the operator 
// should be AND, OR, NOT, joining the expressions together.
//
var mongoose = require('mongoose')
   ,Schema = mongoose.Schema
   ,ObjectId = Schema.ObjectId;
 
var postSchema = new Schema({
    name            : String,
    population      : {type: ObjectId, ref:'Population'},
    operatorOnly    : Boolean,
    left            : {type: Number, ref:'Dimension'},
    leftEx          : {type: ObjectId, ref:'SegmentExpression'},
    operator        : {type: Number, ref:'Operator'},
    right           : {type: Number, ref:'Range'},
    rightEx         : {type: ObjectId, ref:'SegmentExpression'}
});
 
module.exports = mongoose.model('SegmentExpression', postSchema);