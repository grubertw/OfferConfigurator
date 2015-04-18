//
// File: dbInit.js
// Project: offerConfigurator
// Author: Travis Gruber
//
var mongoose = require('mongoose');
var console = require('console');

var Benefit = require(__dirname + '/models/Benefit.js');
var OfferStatus = require(__dirname + '/models/OfferStatus.js');
var OfferType = require(__dirname + '/models/OfferType.js');
var ActionType = require(__dirname + '/models/ActionType.js');
var BillingOnset = require(__dirname + '/models/BillingOnset.js');
var BillingInterval = require(__dirname + '/models/BillingInterval.js');
var Recurrence = require(__dirname + '/models/Recurrence.js');
var ProrationRule = require(__dirname + '/models/ProrationRule.js');
var User = require(__dirname + '/models/User.js');
var PrivilegeType = require(__dirname + '/models/PrivilegeType.js');
var Privilege = require(__dirname + '/models/Privilege.js');


module.exports.initDb = function () {
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
            new BillingInterval({_id: 1, className: "BillingInterval", name: "Daily"}).save();
            new BillingInterval({_id: 2, className: "BillingInterval", name: "Weekly"}).save();
            new BillingInterval({_id: 3, className: "BillingInterval", name: "Biweekly"}).save();
            new BillingInterval({_id: 4, className: "BillingInterval", name: "Monthly"}).save();
        }
    });
    
    //
    // Insert Recurrences.
    //
    Recurrence.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new Recurrence({_id: 0, className: "Recurrence", name: "Indefinite"}).save();
            new Recurrence({_id: 1, className: "Recurrence", name: "1"}).save();
            new Recurrence({_id: 2, className: "Recurrence", name: "2"}).save();
            new Recurrence({_id: 3, className: "Recurrence", name: "3"}).save();
            new Recurrence({_id: 4, className: "Recurrence", name: "4"}).save();
        }
    });
    
    //
    // Insert action types.
    //
    ProrationRule.findOne({_id: 1}, function (err, obj) {
        if (obj == null) {
            new ProrationRule({_id: 1, className: "ProrationRule", name: "Bill difference immediately"}).save();
            new ProrationRule({_id: 2, className: "ProrationRule", name: "Add to next bill"}).save();
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