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
offerConfiguratorServices.service('AppState', ['$state', function ($state) {
    this.authToken = {};
    this.firstName = '';
    this.lastName = '';
    
    // Hides/shows various portions of the UI.
    this.loggedIn = false;
    this.displayTerms = true;
    this.displayTermDetails = false;
    
    this.showGotoPopulation = false;
    this.showGotoOffers = false;
    this.showGotoOffer = false;
    
    // Current selected population.
    this.currPopulationId = {};
    
    // Current selected offer.
    this.currOfferId = {};
    
    //
    // Flip the application back to the logout state.
    //
    this.logout = function () {
        if (this.loggedIn) {
            this.loggedIn = false;
            
            // Clear the jwt token.
            this.authToken = {}
            
            // Go back to the login page.
            $state.go('login');
        }
    };
}]);

//
// Holds application utility methods.
//
offerConfiguratorServices.service('AppUtility', ['Offer', 'Terms', 'Term', 'Merchandising', 'Merchandise', function (Offer, Terms, Term, Merchandising, Merchandise) {
    // Enumerated models requested from the server after successfull login.
    this.dimensions = [];
    this.ranges = [];
    this.operators = [];
    this.offerTypes = [];
    this.offerStatuses = [];
    this.benefits = [];
    this.billingOnsets = [];
    this.billingIntervals = [];
    this.billingPeriods = [];
    this.prorationRules = [];
    this.merchTypes = [];
    this.placements = [];
    
    //
    // Getters on enumerated models.
    // (i.e. models serving as selections within drop-downs)
    //
    
    // Get Dimension by id
    this.getDimension = function (id) {
        var obj = {};
        for (var i = 0; i < this.dimensions.length; i++) {
            var objIt = this.dimensions[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get Range by id
    this.getRange = function (id) {
        var obj = {};
        for (var i = 0; i < this.ranges.length; i++) {
            var objIt = this.ranges[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get ranges within this dimension
    this.getApplicableRangesInDimension = function(dim) {
        var ranges = [];
        for (var i=0; i < this.ranges.length; i++) {
            var objIt = this.ranges[i];
            if (objIt.dimension._id == dim._id) {
                ranges.push(objIt);
            }
        }
        return ranges;
    };
    
    // Get Operator by id
    this.getOperator = function (id) {
        var obj = {};
        for (var i = 0; i < this.operators.length; i++) {
            var objIt = this.operators[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
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
    
    // Get BillingPeriod by id
    this.getBillingPeriod = function (id) {
        var obj = {};
        for (var i = 0; i < this.billingPeriods.length; i++) {
            var objIt = this.billingPeriods[i];
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
    
    // Get MerchTypes by id
    this.getMerchType = function (id) {
        var obj = {};
        for (var i = 0; i < this.merchTypes.length; i++) {
            var objIt = this.merchTypes[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    };
    
    // Get Placements by id
    this.getPlacement = function (id) {
        var obj = {};
        for (var i = 0; i < this.placements.length; i++) {
            var objIt = this.placements[i];
            if (objIt._id == id) {
                obj = objIt;
                break;
            }
        }
        return obj;
    }
   
    // Perform a deep-copy of the passed-in offer. 
    //
    // Copy all offer attributes, benefits, terms, and merchandise.
    // Offers can only be copied if they are in the Unpublished state.
    this.copyOffer = function(currPopulation, selectedOffer, completionCallback) {
        var unpublished = this.getOfferStatus(1);
        
        Offer.create({population:                       currPopulation,
                      offerStatus:                      unpublished,
                      offerType:                        selectedOffer.offerType,
                      split:                            selectedOffer.split,
                      description:                      selectedOffer.description,
                      startDate:                        selectedOffer.startDate,
                      endDate:                          selectedOffer.endDate,
                      // The following attributes are part of the top-level fields of terms.
                      hasTrial:                         selectedOffer.hasTrial,
                      requiresPaymentAuthorization:     selectedOffer.requiresPaymentAuthorization,
                      paymentAuthorizationAmount:       selectedOffer.paymentAuthorizationAmount,
                      shortPaymentDisclosure:           selectedOffer.shortPaymentDisclosure,
                      longPaymentDisclosure:            selectedOffer.longPaymentDisclosure}, function (offer) {
            var i, bene, selectedTerm, merch;

            offer.name = selectedOffer.name;
            offer.offerType = selectedOffer.offerType;
            offer.offerStatus = unpublished;
            offer.benefits = [];
            offer.terms = [];

            // Copy Benefits from selected offer into new offer.
            for(i=0; i<selectedOffer.benefits.length; i++) {
                bene = selectedOffer.benefits[i];
                offer.benefits.push(bene);
            }
            Offer.update({id: offer._id}, offer);

            // Copy Terms from the selected offer into the new offer.
            Terms.listByOffer({offerId: selectedOffer._id}, function (terms) {
                for (i=0; i<terms.length; i++) {
                    var selectedTerm = terms[i];
                    var termAddedCount = 0;

                    // New term object must be created so that making changes
                    // to this term does not modify the term in the selected offer.
                    Term.create({offer:                 offer,
                                 billingOnset:          selectedTerm.billingOnset,
                                 billingInterval:       selectedTerm.billingInterval,
                                 billingPeriod:         selectedTerm.billingPeriod,
                                 prorationRule:         selectedTerm.prorationRule,
                                 isTrial:               selectedTerm.isTrial,
                                 description:           selectedTerm.description,
                                 startDate:             selectedTerm.startDate,
                                 price:                 selectedTerm.price,
                                 msrp:                  selectedTerm.msrp,
                                 hasBillingInterval:    selectedTerm.hasBillingInterval,
                                 billingTimespan:       selectedTerm.billingTimespan,
                                 frequency:             selectedTerm.frequency}, 
                    function (term) {
                        offer.terms.push(term);
                        termAddedCount += 1;

                        if (termAddedCount == terms.length) {
                            Offer.update({id: offer._id}, offer);
                        }
                    });
                }
            });

            // Copy Merchandising from the selected offer into the new offer.
            Merchandising.listByOffer({offerId: selectedOffer._id}, function (merchandising) {
                if (merchandising) {
                    for (i=0; i<merchandising.length; i++) {
                        merch = merchandising[i];

                        Merchandise.create({offer:                 offer,
                                            merchType:             merch.merchType,
                                            placement:             merch.placement,
                                            value:                 merch.value,
                                            notes:                 merch.notes});
                    }
                }
            });
            
            completionCallback(offer);
        });
    };
    
    // The split of an offer must be a whole number, betwen 0 & 100.
    this.validateSplit = function (inputVal) {
        var outputVal = Number(inputVal);
        
        if (   !isNaN(outputVal)
            && (outputVal > 0) ) {
            outputVal = Math.round(outputVal);
            if (outputVal > 100) { 
                outputVal = 100;
            }
        }
        else {
            outputVal = 0;
        }
        
        return outputVal;
    }
    
    // Ensure value is a number with a precision of 2.
    this.validateMonitaryAmount = function (inputVal) {
        var outputVal = inputVal;
        
        if (outputVal.length > 0) {
            var char = outputVal[outputVal.length-1];
            
            if (char != '.') {
                outputVal = Number(outputVal);
        
                if (   !isNaN(outputVal)
                    && (outputVal > 0) ) {
                    outputVal = Math.round(outputVal * 100) / 100;
                }
            }
        }
  
        return outputVal;
    }
}]);

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
// Merchendising service (list by offer)
//
offerConfiguratorServices.factory('Merchandising', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'merchandising/:offerId', {}, 
                     {listByOffer: {method: 'GET', isArray: true, params: {offerId: '@offerId'}, headers: {'authorization': 'Bearer ' + AppState.authToken}}},
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}}
                    );
}]);

//
// Merchandise service (show, create, update, delete).
//
offerConfiguratorServices.factory('Merchandise', ['$resource', 'AppState', function ($resource, AppState) {
    var httpHeaders = {'authorization': 'Bearer ' + AppState.authToken};
    
    return $resource(apiRoute+'merchandise/:id', {id:'@id'},
                     {show:     {method: 'GET', headers: httpHeaders},
                      create:   {method: 'POST', headers: httpHeaders},
                      update:   {method: 'PUT', headers: httpHeaders},
                      delete:   {method: 'DELETE', headers: httpHeaders}});
}]);

//
// SegmentExpression service (show, create, update, delete).
//
offerConfiguratorServices.factory('SegmentExpression', ['$resource', 'AppState', function ($resource, AppState) {
    var httpHeaders = {'authorization': 'Bearer ' + AppState.authToken};
    
    return $resource(apiRoute+'segmentExpression/:id', {id:'@id'},
                     {show:     {method: 'GET', headers: httpHeaders},
                      listByPopulation: {method: 'GET', headers: httpHeaders, isAray: true,
                                         url: apiRoute+'segmentExpression/:populationId', 
                                         params: {populationId:'@populationId'}},
                      create:   {method: 'POST', headers: httpHeaders},
                      update:   {method: 'PUT', headers: httpHeaders},
                      delete:   {method: 'DELETE', headers: httpHeaders}});
}]);

//
// Dimensions service (list)
//
offerConfiguratorServices.factory('Dimensions', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'dimensions', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// Ranges service (list)
//
offerConfiguratorServices.factory('Ranges', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'ranges', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// Operators service (list)
//
offerConfiguratorServices.factory('Operators', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'operators', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
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
// BillingPeriod service (list)
//
offerConfiguratorServices.factory('BillingPeriods', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'billingPeriods', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// ProrationRule service (list)
//
offerConfiguratorServices.factory('ProrationRules', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'prorationRules', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// MerchType service (list)
//
offerConfiguratorServices.factory('MerchTypes', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'merchTypes', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);

//
// Placement service (list)
//
offerConfiguratorServices.factory('Placements', ['$resource', 'AppState', function ($resource, AppState) {
    return $resource(apiRoute+'placements', {}, 
                     {list: {method: 'GET', isArray: true,  headers: {'authorization': 'Bearer ' + AppState.authToken}}});
}]);