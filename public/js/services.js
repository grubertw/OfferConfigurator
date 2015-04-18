'use strict';
//
// File: services.js
// Project: offerConfigurator
// Author: Travis Gruber
//
var offerConfiguratorServices = angular.module('offerConfiguratorServices', ['ngResource']);

//
// Holds application specific state information.
//
offerConfiguratorServices.service('AppState', function () {
    this.loggedIn = false;
    this.authToken = {};
    this.firstName = '';
    this.lastName = '';
    
    // Enumerated models requested from the server after successfull login.
    this.offerTypes = [];
    this.offerStatuses = [];
    this.benefits = [];
    this.billingOnsets = [];
    this.billingIntervals = [];
    this.recurrences = [];
    this.prorationRules = [];
    
    //
    // Getters on enumerated models.
    // (i.e. models serving as selections within drop-downs)
    //
    
    // Get OfferType by id
    this.getOfferType = function (id) {
        var obj = {};
        for (var i = 0; i < this.offerTypes.length; i++) {
            var objIt = this.offerTypes[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get OfferStatus by id
    this.getOfferStatus = function (id) {
        var obj = {};
        for (var i = 0; i < this.offerStatuses.length; i++) {
            var objIt = this.offerStatuses[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get Benefit by id
    this.getBenefit = function (id) {
        var obj = {};
        for (var i = 0; i < this.benefits.length; i++) {
            var objIt = this.benefits[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get BillingOnset by id
    this.getBillingOnset = function (id) {
        var obj = {};
        for (var i = 0; i < this.billingOnsets.length; i++) {
            var objIt = this.billingOnsets[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get BillingInterval by id
    this.getBillingInterval = function (id) {
        var obj = {};
        for (var i = 0; i < this.billingIntervals.length; i++) {
            var objIt = this.billingIntervals[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get Recurrence by id
    this.getRecurrence = function (id) {
        var obj = {};
        for (var i = 0; i < this.recurrences.length; i++) {
            var objIt = this.recurrences[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get ProrationRule by id
    this.getProrationRule = function (id) {
        var obj = {};
        for (var i = 0; i < this.prorationRules.length; i++) {
            var objIt = this.prorationRules[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
});

// Autheticate service.
//
// username is sent plaintext in the html body.
// password is sent as a cryptographic hash in the html body.
// Response from the test server comes as session._id.
// the sessionId is stored in the AppState service and passed 
// as the first argument to every REST API route.
offerConfiguratorServices.factory('Authenticate', ['$resource', function ($resource) {
    return $resource('/api/login', null, { login: { method: 'POST' } });
}]);

// Prepend this route to all HTTP CRUD operations.
// (except autentication)
var apiRoute = "/api/";

//
// Populations service (list only).
//
offerConfiguratorServices.factory('Populations', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'populations', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]); 

//
// Population service (show, create, update, delete).
//
offerConfiguratorServices.factory('Population', ['$resource', 'AppState', function ($resource, AppState) {
    var httpHeaders = {'authorization': 'Bearer ' + AppState.authToken};
    
    return $resource(apiRoute+'population/:id', {id:'@id'},
                     {show:     {method: 'GET', headers: httpHeaders},
                      create:   {method: 'POST', headers: httpHeaders},
                      update:   {method: 'PUT', headers: httpHeaders},
                      delete:   {method: 'DELETE', headers: httpHeaders}});
}]);

//
// Offers service (list by population, or list all)
//
offerConfiguratorServices.factory('Offers', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'offers/:populationId', {}, 
                     {listByPopulation: {method: 'GET', isArray: true, params: {populationId: '@populationId'}, headers: {'authorization': 'Bearer ' + AppState.authToken}}},
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}}
                    );
}]);

//
// Offer service (show, create, update, delete).
//
offerConfiguratorServices.factory('Offer', ['$resource', 'AppState', function ($resource, AppState) {
    var httpHeaders = {'authorization': 'Bearer ' + AppState.authToken};
    
    return $resource(apiRoute+'offer/:id', {id:'@id'},
                     {show:     {method: 'GET', headers: httpHeaders},
                      create:   {method: 'POST', headers: httpHeaders},
                      update:   {method: 'PUT', headers: httpHeaders},
                      delete:   {method: 'DELETE', headers: httpHeaders}});
}]);

//
// Terms service (list by offer)
//
offerConfiguratorServices.factory('Terms', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'terms/:offerId', {}, 
                     {listByOffer: {method: 'GET', isArray: true, params: {offerId: '@offerId'}, headers: {'authorization': 'Bearer ' + AppState.authToken}}},
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}}
                    );
}]);

//
// Term service (show, create, update, delete).
//
offerConfiguratorServices.factory('Term', ['$resource', 'AppState', function ($resource, AppState) {
    var httpHeaders = {'authorization': 'Bearer ' + AppState.authToken};
    
    return $resource(apiRoute+'term/:id', {id:'@id'},
                     {show:     {method: 'GET', headers: httpHeaders},
                      create:   {method: 'POST', headers: httpHeaders},
                      update:   {method: 'PUT', headers: httpHeaders},
                      delete:   {method: 'DELETE', headers: httpHeaders}});
}]);

//
// OfferType service (list)
//
offerConfiguratorServices.factory('OfferTypes', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'offerTypes', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// OfferStatus service (list)
//
offerConfiguratorServices.factory('OfferStatuses', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'offerStatuses', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// Benifit service (list)
//
offerConfiguratorServices.factory('Benefits', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'benefits', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// ActionType service (list)
//
offerConfiguratorServices.factory('ActionTypes', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'actionTypes', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// BillingOnset service (list)
//
offerConfiguratorServices.factory('BillingOnsets', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'billingOnsets', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// BillingInterval service (list)
//
offerConfiguratorServices.factory('BillingIntervals', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'billingIntervals', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// Recurrence service (list)
//
offerConfiguratorServices.factory('Recurrences', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'recurrences', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// ProrationRule service (list)
//
offerConfiguratorServices.factory('ProrationRules', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'prorationRules', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);