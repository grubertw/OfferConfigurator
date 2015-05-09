//
// File: dbInit.js
// Project: offerConfigurator
// Author: Travis Gruber
//
var mongoose = require('mongoose');
var console = require('console');

var Dimension = require(__dirname + '/models/Dimension.js');
var Range = require(__dirname + '/models/Range.js');
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
            new Dimension({_id: 1, className: "Dimension", name: "Age"}).save();
            new Dimension({_id: 2, className: "Dimension", name: "Occupation"}).save();
            new Dimension({_id: 3, className: "Dimension", name: "Anual Income"}).save();
        }
    });
    
    //
    // Insert test Ranges.
    //
    Range.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Range({_id: 1, className: "Range", dimension: 1, name: "0-18"}).save();
            new Range({_id: 2, className: "Range", dimension: 1, name: "19-24"}).save();
            new Range({_id: 3, className: "Range", dimension: 1, name: "25-39"}).save();
            new Range({_id: 4, className: "Range", dimension: 1, name: "40-62"}).save();
            
            new Range({_id: 5, className: "Range", dimension: 2, name: "Doctor"}).save();
            new Range({_id: 6, className: "Range", dimension: 2, name: "Engineer"}).save();
            new Range({_id: 7, className: "Range", dimension: 2, name: "Laywyer"}).save();
            new Range({_id: 8, className: "Range", dimension: 2, name: "Accountant"}).save();
            
            new Range({_id: 9, className: "Range", dimension: 3, name: "$0 - $13,999"}).save();
            new Range({_id:10, className: "Range", dimension: 3, name: "$14,000 - $24,999"}).save();
            new Range({_id:11, className: "Range", dimension: 3, name: "$25,000 - $49,999"}).save();
            new Range({_id:12, className: "Range", dimension: 3, name: "$50,000 - $99,999"}).save();
        }
    });
    
    //
    // Insert test benefits.
    //
    Benefit.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Benefit({_id: 1, className: "Benefit", name: "1B", description: "1B Report, Deliver After Registration"}).save();
            new Benefit({_id: 2, className: "Benefit", name: "Daily 1B", description: "Daily 1B Report, Post Trial, Auto-refresh on Login"}).save();
            new Benefit({_id: 3, className: "Benefit", name: "3M", description: "3M Monitoring"}).save();
        }
    });
    
    //
    // Insert test offer statuses.
    //
    OfferStatus.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            var unpublished = new OfferStatus({_id: 1, className: "OfferStatus", name: "Unpublished", nextAction: "Publish"});
            var published = new OfferStatus({_id: 2, className: "OfferStatus", name: "Published", nextAction: "Deactivate"});
            var deactivated = new OfferStatus({_id: 3, className: "OfferStatus", name: "Deactivated", nextAction: "Deactivate"});
            
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
            new OfferType({_id: 1, className: "OfferType", name: "New Subscription"}).save();
            new OfferType({_id: 2, className: "OfferType", name: "Transactional"}).save();
            new OfferType({_id: 3, className: "OfferType", name: "Retention"}).save();
            new OfferType({_id: 4, className: "OfferType", name: "Cancelation"}).save();
            new OfferType({_id: 5, className: "OfferType", name: "Amendment"}).save();
        }
    });
    
    //
    // Insert action types.
    //
    ActionType.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new ActionType({_id: 1, className: "ActionType", name: "Add"}).save();
            new ActionType({_id: 2, className: "ActionType", name: "Remove"}).save();
        }
    });
    
    //
    // Insert BillingOnsets.
    //
    BillingOnset.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingOnset({_id: 1, className: "BillingOnset", name: "Trial Start"}).save();
            new BillingOnset({_id: 2, className: "BillingOnset", name: "Membership Start"}).save();
            new BillingOnset({_id: 3, className: "BillingOnset", name: "3B3S Delivered"}).save();
            new BillingOnset({_id: 4, className: "BillingOnset", name: "1B1S Delivered"}).save();
            new BillingOnset({_id: 5, className: "BillingOnset", name: "Offer Accepted"}).save();
            new BillingOnset({_id: 6, className: "BillingOnset", name: "End of Previous Charge"}).save();
        }
    });
    
    //
    // Insert BillingIntervals.
    //
    BillingInterval.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingInterval({_id: 1, className: "BillingInterval", name: "days"}).save();
            new BillingInterval({_id: 2, className: "BillingInterval", name: "weeks"}).save();
            new BillingInterval({_id: 3, className: "BillingInterval", name: "months"}).save();
            new BillingInterval({_id: 4, className: "BillingInterval", name: "years"}).save();
        }
    });
    
    //
    // Insert BillingPeriods.
    //
    BillingPeriod.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new BillingPeriod({_id: 0, className: "BillingPeriod", name: "Indefinite"}).save();
            new BillingPeriod({_id: 1, className: "BillingPeriod", name: "1"}).save();
            new BillingPeriod({_id: 2, className: "BillingPeriod", name: "2"}).save();
            new BillingPeriod({_id: 3, className: "BillingPeriod", name: "3"}).save();
            new BillingPeriod({_id: 4, className: "BillingPeriod", name: "4"}).save();
        }
    });
    
    //
    // Insert ProrationRules.
    //
    ProrationRule.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new ProrationRule({_id: 1, className: "ProrationRule", name: "Bill difference immediately"}).save();
            new ProrationRule({_id: 2, className: "ProrationRule", name: "Add to next bill"}).save();
        }
    });
    
    //
    // Insert MerchTypes.
    //
    MerchType.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new MerchType({_id: 1, className: "MerchType", name: "text", dataCode: 2}).save();
            new MerchType({_id: 2, className: "MerchType", name: "image", dataCode: 5}).save();
            new MerchType({_id: 3, className: "MerchType", name: "audio", dataCode: 5}).save();
            new MerchType({_id: 4, className: "MerchType", name: "video", dataCode: 5}).save();
        }
    });
    
    //
    // Insert Placements.
    //
    Placement.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Placement({_id: 1, className: "Placement", name: "top"}).save();
            new Placement({_id: 2, className: "Placement", name: "bottom"}).save();
            new Placement({_id: 3, className: "Placement", name: "left"}).save();
            new Placement({_id: 4, className: "Placement", name: "right"}).save();
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
            var privType = new PrivilegeType({className: "PrivilegeType", name: "ManageUsers"});
            privType.save;
            ManageUsersId = privType._id;
        }
        else
            ManageUsersId = obj._id;
    });
    PrivilegeType.findOne({name: "ManagePopulations"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var privType = new PrivilegeType({className: "PrivilegeType", name: "ManagePopulations"});
            privType.save;
            ManagePopulationsId = privType._id;
        }
        else
            ManagePopulationsId = obj._id;
    });
    PrivilegeType.findOne({name: "ManageOffers"}, function (err, obj) {
        if (obj == null) { // Only insert if not already present.
            var privType = new PrivilegeType({className: "PrivilegeType", name: "ManageOffers"});
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
            var administrator = new User({className: "User", username: "administrator", password: "ecdOCtool",
                                          firstName: "Some", lastName: "Administrator"});
            administrator.save();

            // Give administrator privileges.
            new Privilege({className: "Privilege", privilegeTypeId: ManageUsersId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
            new Privilege({className: "Privilege", privilegeTypeId: ManagePopulationsId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
            new Privilege({className: "Privilege", privilegeTypeId: ManageOffersId, userId: administrator._id,
                           readAccess: true, createAccess: true, updateAccess: true, deleteAccess: true}).save();
        }
    });
}