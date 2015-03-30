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
// Offers service (list by population)
//
offerConfiguratorServices.factory('Offers', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'offers/:populationId', {populationId: '@populationId'}, 
                     {listByPopulation: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
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