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
var User = require(__dirname + '/models/User.js');
var PrivilegeType = require(__dirname + '/models/PrivilegeType.js');
var Privilege = require(__dirname + '/models/Privilege.js');


module.exports.initDb = function () {
    //
    // Insert test benefits.
    //
    Benefit.findOne({enumId: 1}, function (err, obj) {
        if (obj == null) {
            new Benefit({enumId: 1, className: "Benefit", name: "1B", description: "1B Report, Deliver After Registration"}).save();
            new Benefit({enumId: 2, className: "Benefit", name: "Daily 1B", description: "Daily 1B Report, Post Trial, Auto-refresh on Login"}).save();
            new Benefit({enumId: 3, className: "Benefit", name: "3M", description: "3M Monitoring"}).save();
        }
    });
    
    //
    // Insert test offer statuses.
    //
    OfferStatus.findOne({enumId: 1}, function (err, obj) {
        if (obj == null) {
            var unpublished = new OfferStatus({enumId: 1, className: "OfferStatus", name: "Unpublished", nextAction: "Publish"});
            var published = new OfferStatus({enumId: 2, className: "OfferStatus", name: "Published", nextAction: "Deactivate"});
            var deactivated = new OfferStatus({enumId: 3, className: "OfferStatus", name: "Deactivated", nextAction: "Deactivate"});
            
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
    OfferType.findOne({enumId: 1}, function (err, obj) {
        if (obj == null) {
            new OfferType({enumId: 1, className: "OfferType", name: "New Subscription"}).save();
            new OfferType({enumId: 2, className: "OfferType", name: "Transactional"}).save();
            new OfferType({enumId: 3, className: "OfferType", name: "Retention"}).save();
            new OfferType({enumId: 4, className: "OfferType", name: "Cancelation"}).save();
            new OfferType({enumId: 5, className: "OfferType", name: "Amendment"}).save();
        }
    });
    
    //
    // Insert action types.
    //
    ActionType.findOne({enumId: 1}, function (err, obj) {
        if (obj == null) {
            new ActionType({enumId: 1, className: "ActionType", name: "Add"}).save();
            new ActionType({enumId: 2, className: "ActionType", name: "Remove"}).save();
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