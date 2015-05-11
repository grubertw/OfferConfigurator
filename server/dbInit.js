//
// File: dbInit.js
// Project: offerConfigurator
// Author: Travis Gruber
//
var mongoose = require('mongoose');
var console = require('console');

var Dimension = require(__dirname + '/models/Dimension.js');
var Range = require(__dirname + '/models/Range.js');
var Operator = require(__dirname + '/models/Operator.js');
var Benefit = require(__dirname + '/models/Benefit.js');
var OfferStatus = require(__dirname + '/models/OfferStatus.js');
var OfferType = require(__dirname + '/models/OfferType.js');
var ActionType = require(__dirname + '/models/ActionType.js');
var BillingOnset = require(__dirname + '/models/BillingOnset.js');
var BillingInterval = require(__dirname + '/models/BillingInterval.js');
var BillingPeriod = require(__dirname + '/models/BillingPeriod.js');
var ProrationRule = require(__dirname + '/models/ProrationRule.js');
var MerchType = require(__dirname + '/models/MerchType.js');
var Placement = require(__dirname + '/models/Placement.js');
var User = require(__dirname + '/models/User.js');
var PrivilegeType = require(__dirname + '/models/PrivilegeType.js');
var Privilege = require(__dirname + '/models/Privilege.js');


module.exports.initDb = function () {
    //
    // Insert test Dimensions.
    //
    Dimension.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Dimension({_id: 1, name: "Purchase Intent"}).save();
            new Dimension({_id: 2, name: "Previous History"}).save();
            new Dimension({_id: 3, name: "Communications Style"}).save();
        }
    });
    
    //
    // Insert test Ranges.
    //
    Range.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Range({_id: 101, dimension: 1, name: "Curious"}).save();
            new Range({_id: 102, dimension: 1, name: "In Market: Car"}).save();
            new Range({_id: 103, dimension: 1, name: "In Market: House"}).save();
            new Range({_id: 104, dimension: 1, name: "Identity Theft"}).save();
            new Range({_id: 105, dimension: 1, name: "Repair Credit"}).save();
            
            new Range({_id: 201, dimension: 2, name: 'None'}).save();
            new Range({_id: 202, dimension: 2, name: 'One Trial Only'}).save();
            new Range({_id: 203, dimension: 2, name: 'Multiple Trial Only'}).save();
            new Range({_id: 204, dimension: 2, name: 'Negative Experiance'}).save();
            new Range({_id: 205, dimension: 2, name: 'Unprofitable'}).save();
            new Range({_id: 206, dimension: 2, name: 'Marginally Profitable'}).save();
            new Range({_id: 207, dimension: 2, name: 'Highly Profitable'}).save();
            
            new Range({_id: 301, dimension: 3, name: 'Direct'}).save();
            new Range({_id: 302, dimension: 3, name: 'Humorous'}).save();
            new Range({_id: 303, dimension: 3, name: 'Alarming'}).save();
        }
    });
    
    //
    // Insert test Operators.
    //
    Operator.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Operator({_id: 1, sign: "="}).save();
            new Operator({_id: 2, sign: "!="}).save();
            new Operator({_id: 3, sign: "AND"}).save();
            new Operator({_id: 4, sign: "OR"}).save();
            new Operator({_id: 5, sign: "NOT"}).save();
        }
    });
    
    //
    // Insert test benefits.
    //
    Benefit.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Benefit({_id: 1, name: "1B", description: "1B Report, Deliver After Registration"}).save();
            new Benefit({_id: 2, name: "Daily 1B", description: "Daily 1B Report, Post Trial, Auto-refresh on Login"}).save();
            new Benefit({_id: 3, name: "3M", description: "3M Monitoring"}).save();
            new Benefit({_id: 4, name: '1M', description: '1M Monitoring'}).save();
            new Benefit({_id: 5, name: 'Score Monitoring', description: 'Score Monitoring'}).save();
            new Benefit({_id: 6, name: 'Monthly Statement', description: 'Monthly Statement'}).save();
        }
    });
    
    //
    // Insert test offer statuses.
    //
    OfferStatus.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            var unpublished = new OfferStatus({_id: 1, name: "Unpublished", nextAction: "Publish"});
            var published = new OfferStatus({_id: 2, name: "Published", nextAction: "Deactivate"});
            var deactivated = new OfferStatus({_id: 3, name: "Deactivated", nextAction: "Deactivate"});
            
            unpublished.nextStatus = published._id;
            published.nextStatus = deactivated._id;
            deactivated.nextStatus = deactivated._id;
            
            unpublished.save();
            published.save();
            deactivated.save();
        }
    });
    
    //
    // Insert test OfferTypes.
    //
    OfferType.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new OfferType({_id: 1, name: "New Subscription"}).save();
            new OfferType({_id: 2, name: "Transactional"}).save();
            new OfferType({_id: 3, name: "Retention"}).save();
            new OfferType({_id: 4, name: "Cancelation"}).save();
            new OfferType({_id: 5, name: "Amendment"}).save();
        }
    });
    
    //
    // Insert action types.
    //
    ActionType.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new ActionType({_id: 1, name: "Add"}).save();
            new ActionType({_id: 2, name: "Remove"}).save();
        }
    });
    
    //
    // Insert BillingOnsets.
    //
    BillingOnset.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingOnset({_id: 1, name: "Trial Start"}).save();
            new BillingOnset({_id: 2, name: "Membership Start"}).save();
            new BillingOnset({_id: 3, name: "3B3S Delivered"}).save();
            new BillingOnset({_id: 4, name: "1B1S Delivered"}).save();
            new BillingOnset({_id: 5, name: "Offer Accepted"}).save();
            new BillingOnset({_id: 6, name: "End of Previous Charge"}).save();
        }
    });
    
    //
    // Insert BillingIntervals.
    //
    BillingInterval.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingInterval({_id: 1, name: "months"}).save();
            new BillingInterval({_id: 2, name: "years"}).save();
        }
    });
    
    //
    // Insert BillingPeriods.
    //
    BillingPeriod.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingPeriod({_id: 0, name: "Indefinite"}).save();
            new BillingPeriod({_id: 1, name: "1"}).save();
            new BillingPeriod({_id: 2, name: "2"}).save();
            new BillingPeriod({_id: 3, name: "3"}).save();
            new BillingPeriod({_id: 4, name: "4"}).save();
        }
    });
    
    //
    // Insert ProrationRules.
    //
    ProrationRule.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new ProrationRule({_id: 1, name: "Bill difference immediately"}).save();
            new ProrationRule({_id: 2, name: "Add to next bill"}).save();
        }
    });
    
    //
    // Insert MerchTypes.
    //
    MerchType.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new MerchType({_id: 1, name: "text", dataCode: 2}).save();
            new MerchType({_id: 2, name: "image", dataCode: 5}).save();
            new MerchType({_id: 3, name: "audio", dataCode: 5}).save();
            new MerchType({_id: 4, name: "video", dataCode: 5}).save();
        }
    });
    
    //
    // Insert Placements.
    //
    Placement.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Placement({_id: 1, name: "top"}).save();
            new Placement({_id: 2, name: "bottom"}).save();
            new Placement({_id: 3, name: "left"}).save();
            new Placement({_id: 4, name: "right"}).save();
        }
    });
    
    
    //
    // Ensure the default PrivilegeType(s) are present.
    //
    var ManageUsersId = {};
    var ManagePopulationsId = {};
    var ManageOffersId = {};
    PrivilegeType.findOne({name: "ManageUsers"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var privType = new PrivilegeType({name: "ManageUsers"});
            privType.save;
            ManageUsersId = privType._id;
        }
        else
            ManageUsersId = obj._id;
    });
    PrivilegeType.findOne({name: "ManagePopulations"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var privType = new PrivilegeType({name: "ManagePopulations"});
            privType.save;
            ManagePopulationsId = privType._id;
        }
        else
            ManagePopulationsId = obj._id;
    });
    PrivilegeType.findOne({name: "ManageOffers"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var privType = new PrivilegeType({name: "ManageOffers"});
            privType.save;
            ManageOffersId = privType._id;
        }
        else
            ManageOffersId = obj._id;
    });

    //
    // Insure the admin user is present.
    //
    User.findOne({username: "administrator"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var administrator = new User({username: "administrator", password: "ecdOCtool",
                                          lastName: "Administrator"});
            administrator.save();

            // Give administrator privileges.
            new Privilege({privilegeTypeId: ManageUsersId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
            new Privilege({privilegeTypeId: ManagePopulationsId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
            new Privilege({privilegeTypeId: ManageOffersId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
        }
    });
}
