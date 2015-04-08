//
// File: app.js
// Project: offerConfigurator
// Author: Travis Gruber
//

// Master module for app.  
// Contains/Loads the angular-ui-router module and the controllers module
// (at some point it may make sense to group the controllers into 
// different sub-modules)
var offerConfiguratorApp = angular.module('offerConfiguratorApp', 
                                          ['ui.router',
                                           'offerConfiguratorServices',
                                           'offerConfiguratorControllers'
                                           ]);

// Confgue client-side routes.
//
// NOTE:  These routes do NOT result in an HTTP GET.
// Instead, Angular intercepts these, binding them to the 
// configured controllers.
//
// NOTE: ui-router appends urls together using the state information.
// route parameters are scoped to the state and do NOT inherit from the 
// parent state.
offerConfiguratorApp.config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/login');
    $stateProvider.
        state('login', {
            url: '/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        }).
        state('populations', {
            url: '/populations',
            templateUrl: 'templates/populations.html',
            controller: 'PopulationsController'
        }).
        state('populationDetails', {
            url: '/populations/:populationId',
            templateUrl: 'templates/population-detail.html',
            controller: 'PopulationDetailsController'
        }).
        state('offers', {
            url: '/populations/:populationId/offers',
            templateUrl: 'templates/offers.html',
            controller: 'OffersController'
        }).
        state('populations.populationDetails.offers.offerDetails', {
            url: '/:offerId',
            templateUrl: 'templates/offer-details.html',
            controller: 'OfferDetailsController'
        }).
        state('populations.populationDetails.offers.offerDetails.benefits', {
            url: '/benefits',
            templateUrl: 'templates/benefits.html',
            controller: 'BenefitsController'
        }).
        state('populations.populationDetails.offers.offerDetails.terms', {
            url: '/terms',
            templateUrl: 'templates/terms.html',
            controller: 'TermsController'
        }).
        state('populations.populationDetails.offers.offerDetails.charges', {
            url: '/charge/:chargeId',
            templateUrl: 'templates/charges.html',
            controller: 'ChargesController'
        }).
        state('populations.populationDetails.offers.offerDetails.merchandising', {
            url: '/merchandising',
            templateUrl: 'templates/merchandising.html',
            controller: 'OfferMerchandisingController'
        });
});