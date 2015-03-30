//
// File: models.js
// Project: offerConfigurator
// Author: Travis Gruber
//

// Create the models namespace.
var models = {currPopulationId: 1,
              currExpressionId: 1,
              currOfferId: 1,
              currChargeId: 1,
              currMerchandisingId: 1};

// Population represents a set of offers, covering segments of a population
// (of people).
models.Population = function () {
    'use strict';
    this.className = "Population"; // What type of model this is.
    this.name = "New Population"; // Name of population.
    this.status = "Active"; // All offers must be active within the population.
    
    this.offers = []; // Set of offers in this population.
    
    // Logical expression that matches a population of people.
    // As a minimum, this list contains at least one expression component.
    // An expression component contains a dimension, an operator (=|!=),
    // and a range.  If another expression component is 
    // added an operator (and,or,not) must be placed in between.  These two
    // expression components then, with the operator, become a complex 
    // expression component (a.k.a. an object who's left and right are 
    // SegmentExperssion rather than SegmentDimension).
    this.segmentExpression = [];
    
    this.populationId = models.currPopulationId;
    models.currPopulationId = models.currPopulationId + 1;
};

models.SegmentExpression = function (leftEx, op, rightEx) {
    'use strict';
    this.className = "Expression";
    
    this.leftExpression = leftEx;
    this.leftId = leftEx.dimensionId;
    this.leftClassName = leftEx.className;
    
    this.operator = op;
    this.operatorId = op.operatorId;
    
    this.rightExpression = rightEx;
    this.rightId = rightEx.rangeId;
    this.rightClassName = rightEx.className;
    
    this.expressionId = models.currExpressionId;
    models.currExpressionId = models.currExpressionId + 1;
};

models.Offer = function () {
    'use strict';
    this.className = "Offer"; // What type of model this is.
    this.name = "New Offer"; // Name of offer.
    this.offerTypeId = 1; // New Subscription
    this.split = 100; // 100% split by default.
    this.status = "Active";
    this.startTime = new Date(); // Time the first offer activates.
    this.stopTime = new Date(); // Time the last offer expires.
    
    // These attributs are editable in offer details.
    this.internalDescription = "";
    
    // These attributes show in the terms tab
    this.paymentAuthorizationAmount = "";
    this.shortPaymentDisclosure = "";
    this.longPaymentDisclosure = "";
    
    this.benefits = []; // Set of benefits in this offer.
    this.charges = []; // Set of charges in this offer.
    this.merchendising = []; // Set of merchendising in this offer.
    
    this.populationId = 0; // The containing population ID.
    
    this.offerId = models.currOfferId;
    models.currOfferId = models.currOfferId + 1;
};


models.Charge = function () {
    'use strict';
    this.className = "Charge";
    this.order = 1;
    this.name = "New Charge";
    this.amount = "";
    this.msrp = "";
    this.billingOnsetId = 1; // Trial Start.
    this.timeSpan = "30 days";
    this.recurrence = "";
    
    // These attributes show in chage details tab.
    this.isTrial = false;
    this.prorationRule = {};
    
    this.offerId = 0; // The containing offer ID.
    
    this.chargeId = models.currChargeId;
    models.currChargeId = models.currChargeId + 1;
};

models.Merchendising = function () {
    'use strict';
    this.className = "Merchendising";
    this.name = "";
    this.dataType = "String";
    this.placementHint = "";
    this.value = "";
    this.notes = "";
};

// Accessors for the test data.  
// FIXME: These should be replaced by HTTP get requests.
models.getPopulation = function (popId) {
    'use strict';
    var pop = {};
    
    for (var i = 0; i < models.populations.length; i++) {
        var popIt = models.populations[i];
        
        if (popIt.populationId == popId) {
            pop = popIt;
            break;
        }
    }
    
    return pop;
};

models.getSegmentExpression = function (popId) {
    'use strict';
    var expressions = [];
    
    for (var i = 0; i < models.expressions.length; i++) {
        var exIt = models.expressions[i];
        
        if (exIt.populationId == popId) {
            var expression = exIt;
            
            // Construct object tree from IDs.
            if (expression.className == 'Operator') {
                expression = models.getOperator(expression.operatorId);
            }
            else if (expression.className == 'Expression') {
                if (expression.leftClassName == 'Dimension') {
                    expression.leftExpression = models.getDimension(expression.leftId);
                }
                
                expression.operator = models.getOperator(expression.operatorId);
                
                if (expression.rightClassName == 'Range') {
                    expression.rightExpression = models.getRange(expression.rightId);
                }
            }
            
            expressions.push(expression);
        }
    }
    
    return expressions;
};

models.getDimension = function (dimensionId) {
    'use strict';
    var obj = {};
    for (var i = 0; i < models.dimensions.length; i++) {
        var objIt = models.dimensions[i];
        if (objIt.dimensionId == dimensionId) {
            // Each object in the expression tree must be it's own instance.
            obj = JSON.parse(JSON.stringify(objIt));
            break;
        }
    }
    return obj;
};

models.getOperator = function (operatorId) {
    'use strict';
    var obj = {};
    for (var i = 0; i < models.operators.length; i++) {
        var objIt = models.operators[i];
        if (objIt.operatorId == operatorId) {
            // Each object in the expression tree must be it's own instance.
            obj = JSON.parse(JSON.stringify(objIt));
            break;
        }
    }
    return obj;
};

models.getRange = function (rangeId) {
    'use strict';
    var obj = {};
    for (var i = 0; i < models.ranges.length; i++) {
        var objIt = models.ranges[i];
        if (objIt.rangeId == rangeId) {
            // Each object in the expression tree must be it's own instance.
            obj = JSON.parse(JSON.stringify(objIt));
            break;
        }
    }
    return obj;
};

models.getApplicableRangesInDimension = function(dimensionId) {
    'use strict';
    var ranges = [];
    for (var i = 0; i < models.ranges.length; i++) {
        var objIt = models.ranges[i];
        if (objIt.dimensionId == dimensionId) {
            ranges.push(objIt);
        }
    }
    return ranges;
};

models.setApplicableRangesInDimensions = function () {
    'use strict';
    for (var i = 0; i < models.dimensions.length; i++) {
        var dimension = models.dimensions[i];
        var applicableRanges = models.getApplicableRangesInDimension(dimension.dimensionId);
        dimension.applicableRanges = applicableRanges;
    }
};

models.getOffers = function (popId) {
    'use strict';
    var offers = [];
    
    for (var i = 0; i < models.offers.length; i++) {
        var offerIt = models.offers[i];
        
        if (offerIt.populationId == popId) {
            offers.push(offerIt);
        }
    }
    
    return offers;
};

//
// Code below loads test data.
// This should be rquested from the server with an HTTP GET
// and returned in a JSON structure.
//

//
// Static data.
//
var testRanges =
'[\
    {"rangeId":"1", "className":"Range", "dimensionId":"1", "range":"Male"},\
    {"rangeId":"2", "className":"Range", "dimensionId":"1", "range":"Female"},\
    {"rangeId":"3", "className":"Range", "dimensionId":"2", "range":"0-14"},\
    {"rangeId":"4", "className":"Range", "dimensionId":"2", "range":"15-18"},\
    {"rangeId":"5", "className":"Range", "dimensionId":"2", "range":"19-22"},\
    {"rangeId":"6", "className":"Range", "dimensionId":"2", "range":"23-26"},\
    {"rangeId":"7", "className":"Range", "dimensionId":"2", "range":"27-35"},\
    {"rangeId":"8", "className":"Range", "dimensionId":"2", "range":"36-49"},\
    {"rangeId":"9", "className":"Range", "dimensionId":"2", "range":"50-69"},\
    {"rangeId":"10", "className":"Range", "dimensionId":"2", "range":"70-99"},\
    {"rangeId":"11", "className":"Range", "dimensionId":"3", "range":"Cacusian"},\
    {"rangeId":"12", "className":"Range", "dimensionId":"3", "range":"Hispanic"},\
    {"rangeId":"13", "className":"Range", "dimensionId":"3", "range":"Asian"},\
    {"rangeId":"14", "className":"Range", "dimensionId":"3", "range":"African"},\
    {"rangeId":"15", "className":"Range", "dimensionId":"4", "range":"Engineer"},\
    {"rangeId":"16", "className":"Range", "dimensionId":"4", "range":"Doctor"},\
    {"rangeId":"17", "className":"Range", "dimensionId":"4", "range":"Laywer"},\
    {"rangeId":"18", "className":"Range", "dimensionId":"4", "range":"Military"},\
    {"rangeId":"19", "className":"Range", "dimensionId":"4", "range":"Law Enforcement"},\
    {"rangeId":"20", "className":"Range", "dimensionId":"5", "range":"$0 - $15,999"},\
    {"rangeId":"21", "className":"Range", "dimensionId":"5", "range":"$16,0000 - $27,999"},\
    {"rangeId":"22", "className":"Range", "dimensionId":"5", "range":"$28,0000 - $49,999"},\
    {"rangeId":"23", "className":"Range", "dimensionId":"5", "range":"$50,000 - $89,999"},\
    {"rangeId":"24", "className":"Range", "dimensionId":"5", "range":"$90,000 - $119,000"},\
    {"rangeId":"25", "className":"Range", "dimensionId":"5", "range":"$120,000 - $199,000"}\
]';
models.ranges = JSON.parse(testRanges);

var testDimensions =
'[\
    {"dimensionId":"1", "className":"Dimension", "name":"Gender"},\
    {"dimensionId":"2", "className":"Dimension", "name":"Age"},\
    {"dimensionId":"3", "className":"Dimension", "name":"Race"},\
    {"dimensionId":"4", "className":"Dimension", "name":"Occupation"},\
    {"dimensionId":"5", "className":"Dimension", "name":"Annual Income"}\
]';
models.dimensions = JSON.parse(testDimensions);

var testOperators = 
'[\
    {"operatorId":"1", "className":"Operator", "sign":"="},\
    {"operatorId":"2", "className":"Operator", "sign":"!="},\
    {"operatorId":"3", "className":"Operator", "sign":"AND"},\
    {"operatorId":"4", "className":"Operator", "sign":"OR"},\
    {"operatorId":"5", "className":"Operator", "sign":"NOT"}\
]';
models.operators = JSON.parse(testOperators);


var testExpressions =
'[\
    {"expressionId":"1", "className":"Expression", "populationId":"1",\
        "leftId":"1", "leftClassName":"Dimension", "operatorId":"1", "rightId":"1", "rightClassName":"Range"},\
    {"expressionId":"2", "className":"Operator", "populationId":"1", "operatorId":"3"},\
    {"expressionId":"3", "className":"Expression", "populationId":"1",\
        "leftId":"2", "leftClassName":"Dimension", "operatorId":"1", "rightId":"3", "rightClassName":"Range"}\
]';
models.expressions = JSON.parse(testExpressions);

var testOfferTypes =
'[\
    {"offerTypeId":"1", "className":"OfferType", "name":"New Subscription"},\
    {"offerTypeId":"2", "className":"OfferType", "name":"Transactional"},\
    {"offerTypeId":"3", "className":"OfferType", "name":"Retention"},\
    {"offerTypeId":"4", "className":"OfferType", "name":"Cancelation"},\
    {"offerTypeId":"5", "className":"OfferType", "name":"Amendment"}\
]';
models.offerTypes = JSON.parse(testOfferTypes);

var testBenefits =
'[\
    {"benefitId":"1", "className":"Benefit", "name":"1B Report, Deliver After Registration", "action":"Add"},\
    {"benefitId":"2", "className":"Benefit", "name":"Daily 1B Report, Post Trial, Auto-refresh on Login", "action":"Add"},\
    {"benefitId":"3", "className":"Benefit", "name":"3M Monitoring", "action":"Add"}\
]';
models.benefits = JSON.parse(testBenefits);

var testBillingOnsets =
'[\
    {"billingOnsetId":"1", "className":"BillingOnset", "name":"Trial Start"},\
    {"billingOnsetId":"2", "className":"BillingOnset", "name":"Membership Start"},\
    {"billingOnsetId":"3", "className":"BillingOnset", "name":"3B3S Delivered"},\
    {"billingOnsetId":"4", "className":"BillingOnset", "name":"1B1S Delivered"},\
    {"billingOnsetId":"5", "className":"BillingOnset", "name":"Offer Delivered"},\
    {"billingOnsetId":"6", "className":"BillingOnset", "name":"End of Previous Charge"}\
]';
models.billingOnsets = JSON.parse(testBillingOnsets);

//
// Dynamic data
//
var testPopulations =
'[\
    {"populationId":"1", "className":"Population", "name":"No subscription, auto inserted, 3B aware", "status":"Active"},\
    {"populationId":"2", "className":"Population", "name":"No subscription, auto inserted, 3B aware", "status":"Active"},\
    {"populationId":"3", "className":"Population", "name":"Active subscription, auto inserted, 3B purchased", "status":"Active"},\
    {"populationId":"4", "className":"Population", "name":"Active subscription, auto inserted, 3B interested", "status":"Active"}\
]';
models.populations = JSON.parse(testPopulations);

var testOffers =
'[\
    {"offerId":"1", "className":"Offer", "name":"$17.95/month trial w/ 3M", "offerTypeId":"1", "split":"75", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30",\
            "benefits":[\
                {"benefitId":"1", "action":"Add"},\
                {"benefitId":"2", "action":"Add"}], "populationId":"1"},\
    {"offerId":"2", "className":"Offer", "name":"$12.95/month trial w/ 3M", "offerTypeId":"1", "split":"25", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30", "populationId":"1"},\
    {"offerId":"3", "className":"Offer", "name":"$15.95/month trial", "offerTypeId":"2", "split":"75", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30", "populationId":"2"},\
    {"offerId":"4", "className":"Offer", "name":"$11.95/month immediate bill", "offerTypeId":"1", "split":"25", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30", "populationId":"2"},\
    {"offerId":"5", "className":"Offer", "name":"$34.95 3B3S", "offerTypeId":"1", "split":"50", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30", "populationId":"4"},\
    {"offerId":"6", "className":"Offer", "name":"$37.95 3B3S", "offerTypeId":"1", "split":"50", "status":"Active",\
        "startTime":"03/12/2014 00:01", "stopTime":"04/15/2015 14:30", "populationId":"4"}\
]';
models.offers = JSON.parse(testOffers);

var testCharges =
'[\
    {"chargeId":"1", "className":"Charge", "orderWithinOffer":"1", "name":"$1 trial charge", "amount":"$1",\
        "billingOnsetId":"1",\
        "recurrence":"None", "timeSpan":"30 days", "isTrial":"true"},\
    {"chargeId":"2", "className":"Charge", "orderWithinOffer":"2", "name":"$99.95/year subscription charge", "amount":"$99.95", "msrp":"$179.95",\
        "billingOnsetId":"2",\
        "recurrence":"Every 1 year for 1 Billing Period", "timeSpan":"30 days", "isTrial":"false"},\
    {"chargeId":"3", "className":"Charge", "orderWithinOffer":"3", "name":"$14.95/month subscription charge", "amount":"$14.95", "msrp":"$19.95",\
        "billingOnsetId":"6",\
        "recurrence":"Every 1 Month for Indefinite Billing Periods", "timeSpan":"30 days", "isTrial":"false"}\
]';
models.charges = JSON.parse(testCharges);
