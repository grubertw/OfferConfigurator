//
// File: controllers.js
// Project: offerConfigurator
// Author: Travis Gruber
//

// Factory for creating Angular controllers.
var offerConfiguratorControllers = angular.module('offerConfiguratorControllers', 
                                                  ['ui.router',
                                                   'offerConfiguratorServices']);

//
// Login controller.
// - Responsible for user authentication.
//
offerConfiguratorControllers.controller('LoginController', 
                                        ['$scope', '$state', 'AppState', 'Authenticate',
                                         LoginController]);
function LoginController($scope, $state, AppState, Authenticate) {
    // Collect Username and Password for authentication with the server.
    $scope.username = 'administrator';
    $scope.password = 'ecdOCtool';
    
    var sCert = '-----BEGIN CERTIFICATE-----\
MIID+jCCAuWgAwIBAgIJAKu+oBDnaFpaMA0GCSqGSIb3DQEBCwUAMIGWMQswCQYD\
VQQGEwJVUzELMAkGA1UECAwCQ0ExHzAdBgNVBAcMFlJhbmNobyBTYW50YSBNYXJn\
YXJpdGExDzANBgNVBAoMBlRyYXZpczEUMBIGA1UECwwLRW5naW5lZXJpbmcxDzAN\
BgNVBAMMBlRyYXZpczEhMB8GCSqGSIb3DQEJARYSZ3J1YmVydHdAZ21haWwuY29t\
MB4XDTE1MDMyODIyMDU1NFoXDTQyMDgxMzIyMDU1NFowgZYxCzAJBgNVBAYTAlVT\
MQswCQYDVQQIDAJDQTEfMB0GA1UEBwwWUmFuY2hvIFNhbnRhIE1hcmdhcml0YTEP\
MA0GA1UECgwGVHJhdmlzMRQwEgYDVQQLDAtFbmdpbmVlcmluZzEPMA0GA1UEAwwG\
VHJhdmlzMSEwHwYJKoZIhvcNAQkBFhJncnViZXJ0d0BnbWFpbC5jb20wggEeMA0G\
CSqGSIb3DQEBAQUAA4IBCwAwggEGAoH+CbfyeQt7ADVIiU/NCpckaFPCsgwGMfmf\
q+gc0D0vtVIjyXWHTg2dzE1sdzY1HWx8q+Q/Di6RtACiM8l5JDb9JdIeVbZ1xqht\
uPNpzRCWxN+usy9CwlIiv0gLK3qOksJE92NvWITTJunCEVSRQfIdNyUrGQxMv9zd\
JpdMez7U78tQQaDEcRATiCd7kyF4c3Y4R6rFV7flULMR8sPoEnywAs19UcZSbVoE\
ocUzQkozOGH57tZsD8avuUDAdmFpRRyaVLIuDbXg7LH3Ct7VirOKt7p+5VX3ZgjM\
SarhlDYRA4LGi5DVY8zsrlCayDVxq2fymIQF5Pdw6x3KyvnyS9cCAwEAAaNQME4w\
HQYDVR0OBBYEFMxw5iB6IIV5TCjsdJ2/Vy5K0JewMB8GA1UdIwQYMBaAFMxw5iB6\
IIV5TCjsdJ2/Vy5K0JewMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQELBQADgf8A\
ASQep2wbygMbjXgnbBh/tbgvzCpFSm1DqIMBLgwMPyOdLvv3I1Xm4tptSDuwJyi/\
uLGzKpK+w2OaHHGXGsvdzVBfafHQ2ZZ6VWX49t9wb/jabMNjpZEDwMwCbeCp2FzO\
NDF3Tan6CcQHZc3f/86bc7mpkz1V0rhudxTqILPrznNMAaUgFMDmZCoamUvj99r1\
FBpMBqUCM82E+c/NCauunRiSikpMJ8M3vGBRtvvuRui8MXQLZwEF8uj5Dg8ze+ns\
So59bMGeymGBjBaiBs2xcyZN3/Dm2Tc+FNjuwvtoAone7iuUaSqorlbdtIuvjv5D\
5YYSu170DY0HyZg8zzE=\
-----END CERTIFICATE-----';
    
    // Authendicate user with the sever.
    $scope.authenticate = function () {
        if (!AppState.loggedIn) {
            // Pass username and password as one JSON in the body.
            // expects a session object with a sessionId.
            var credentials = {username:$scope.username, password:$scope.password};
            Authenticate.login(credentials, function (token) {
                var jws = new KJUR.jws.JWS();

                var cert = new X509();
                cert.readCertPEM(sCert);

                var isVarified = jws.verifyJWSByKey(token.token, cert.subjectPublicKeyRSA);
                var tokenInfo = JSON.parse(jws.parsedJWS.payloadS);
                
                if (isVarified == 1) {
                    AppState.loggedIn = true;
                    AppState.authToken = token.token;
                    AppState.firstName = tokenInfo.firstName;
                    AppState.lastName = tokenInfo.lastName;
                                        
                    $state.go('populations');
                }
            });
        }
    };
}

//
// Controls header information.
// 
offerConfiguratorControllers.controller('HeaderController', 
                                        ['$scope', '$state', 'AppState',
                                         HeaderController]);
function HeaderController($scope, $state, AppState) {
    $scope.appState = AppState;
    
    // Initialize models.
    models.setApplicableRangesInDimensions();
    
    //
    // Navigation methods.
    //
    $scope.gotoPopulations = function () {
        AppState.showGotoPopulation = false;
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        
        $state.go('populations');
    };
    $scope.gotoSelectedPopulation = function () {
        AppState.showGotoPopulation = false;
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        
        $state.go('populationDetails', {populationId: AppState.currPopulation._id});
    };
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        
        $state.go('offers', {populationId: AppState.currPopulation._id});
    };
    $scope.gotoSelectedOffer = function () {
        AppState.showGotoOffer = false;
        
        $state.go('offerDetails', {offerId: AppState.currOffer._id});
    };
    
    //
    // Logout by flipping the variables in the AppState.
    //
    $scope.logout = function() {
        AppState.logout();
    };
}

//
// Controls add/remove/edit of populations. 
// On edit of a population, will route to the PopulationDetailsController,
// passing the populationId.
//
offerConfiguratorControllers.controller('PopulationsController', 
                                        ['$scope', 'Populations', 'Population', 'AppState',
                                         'OfferTypes', 'OfferStatuses', 'Benefits', 'ActionTypes',
                                         'BillingOnsets', 'BillingIntervals', 'BillingPeriods', 'ProrationRules',
                                         'Placements',
                                         PopulationsController]);
function PopulationsController($scope, Populations, Population, AppState, 
                               OfferTypes, OfferStatuses, Benefits, ActionTypes,
                               BillingOnsets, BillingIntervals, BillingPeriods, ProrationRules, Placements) {
    // Prefetch enumerations from the server here
    // FIXME:
    // This should be done in the login handler function,
    // but for some reason, angular has trouble injecting an updated 
    // AppState into the model REST services.
    AppState.offerTypes = OfferTypes.list();
    AppState.offerStatuses = OfferStatuses.list();
    AppState.benefits = Benefits.list();
    AppState.billingOnsets = BillingOnsets.list();
    AppState.billingIntervals = BillingIntervals.list();
    AppState.billingPeriods = BillingPeriods.list();
    AppState.prorationRules = ProrationRules.list();
    AppState.placements = Placements.list();
    
    // Fetch the populations from the server.
    $scope.populations = Populations.list();
    
    // Toggle remove/edit populations.
    $scope.editPopulations = false;
    $scope.removePopulations = false;
    
    //
    // Supported Opperations
    //
    $scope.toggleEditPopulations = function () {
        $scope.editPopulations = !$scope.editPopulations;
    };
    $scope.toggleRemovePopulations = function () {
        $scope.removePopulations = !$scope.removePopulations;
    };
    $scope.addPopulation = function () {
        var newPopulation = Population.create();
        $scope.populations.push(newPopulation);
    };
    $scope.removePopulation = function (pop) {
        Population.delete({id: pop._id});
        var index = $scope.populations.indexOf(pop);
        $scope.populations.splice(index, 1);
    };
}

//
// Controls editing population details.
// Containes logical population segment expression builder that acts as 
// a means to characterize a group of people.
// 
offerConfiguratorControllers.controller('PopulationDetailsController', 
                                        ['$scope', '$stateParams', 'AppState', 'Population',
                                         PopulationDetailsController]);
function PopulationDetailsController($scope, $stateParams, AppState, Population) {
    // Lookup the population by it's ID.
    $scope.population = Population.show({id:$stateParams.populationId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Update Application State.
    AppState.currPopulation = $scope.population;
    
    // Attach the segment expression object tree to the population.
    $scope.population.segmentExpression = models.getSegmentExpression($stateParams.populationId);
    
    $scope.supportedDimensions = models.dimensions; // FIXME: this should be an HTTP GET.
    
    // When a dimension is chosen for an expression, the range must be updated
    // so as not to specify the range of a different dimension.
    $scope.setDimension = function (expression, dimension) {
        expression.leftExpression = dimension;
        expression.leftId = dimension.dimensionId;
        expression.rightExpression = models.getApplicableRangesInDimension(dimension.dimensionId)[0];
        expression.rightId = expression.rightExpression.rangeId;
    };
    // Esnure currect operator instance is set into expression.
    $scope.setOperator = function (operator, operatorId) {
        var opCopy = models.getOperator(operatorId);
        operator.operatorId = opCopy.operatorId;
        operator.sign = opCopy.sign;
    };
    // Add a new expression to the segment expression.
    $scope.addExpression = function () {
        var expression = new models.SegmentExpression(models.getDimension(1), models.getOperator(1), models.getRange(1));
        expression.populationId = $scope.population.populationId;
        
        // If the complete expression is empty, add 1 new expression only.
        if (   (typeof($scope.population.segmentExpression) === 'undefined')
            || ($scope.population.segmentExpression.length == 0) ) {
            $scope.population.segmentExpression = [expression];
        }
        // If there is at least one expression, add an outer operator + a new expression.
        else {
            var outerOp = models.getOperator(3);
            outerOp.populationId = $scope.population.populationId;
            models.expressions.push(outerOp);
            
            $scope.population.segmentExpression.push(outerOp);
            $scope.population.segmentExpression.push(expression);
        }
        
        models.expressions.push(expression);
    };
    // Removes the selected expression from the complete segment expression.
    $scope.removeExpression = function(expression) {
        var index = $scope.population.segmentExpression.indexOf(expression);
        if ($scope.population.segmentExpression.length > 1) {
            $scope.population.segmentExpression.splice(index-1, 2); // Remove the outer operator AND the expression.
        }
        else {
            $scope.population.segmentExpression.splice(index, 1); // remove expression.
        }
    }
    
    $scope.savePopulation = function () {
        Population.update({id:$scope.population._id}, $scope.population);
    }
}

//
// Controller for adding/removing Offers.
//
offerConfiguratorControllers.controller('OffersController', 
                                        ['$scope', 
                                         '$stateParams',
                                         'AppState',
                                         'Population',
                                         'Offers', 'Offer',
                                         OffersController]);
function OffersController($scope, $stateParams, AppState, Population, Offers, Offer) {
    // Lookup the population by it's ID.
    $scope.population = Population.show({id: $stateParams.populationId});
    // Perform HTTP GET for all offers in the population.
    $scope.offers = Offers.listByPopulation({populationId: $stateParams.populationId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Update the Application State.
    AppState.showGotoPopulation = true;
    
    // Toggle remove/edit offers.
    $scope.editOffers = false;
    $scope.removeOffers = false;
    
    //
    // Supported opperations.
    //
    $scope.toggleEditOffers = function () {
        $scope.editOffers = !$scope.editOffers;
    };
    $scope.toggleRemoveOffers = function () {
        $scope.removeOffers = !$scope.removeOffers;
    };
    $scope.addOffer = function () {
        // Create an offer within the selected population.
        // Set default values for offerStatus and offerType.
        // All other fields can be modified on a REST update.
        var defaultStatus = AppState.getOfferStatus(1);
        var defaultOfferType = AppState.getOfferType(1);
        var now = new Date();
        
        Offer.create({population:                       $scope.population,
                      offerStatus:                      defaultStatus,
                      offerType:                        defaultOfferType,
                      description:                      "offer description here",
                      startDate:                        now,
                      endDate:                          now,
                      // The following attributes are part of the top-level fields of terms.
                      hasTrial:                         false,
                      requiresPaymentAuthorization:     false,
                      paymentAuthorizationAmount:       "$0.0",
                      shortPaymentDisclosure:           "short payment disclosure",
                      longPaymentDisclosure:            "long payment disclosure"},
                     function (offer) {
            offer.offerStatus = defaultStatus;
            offer.offerType = defaultOfferType;
            $scope.offers.push(offer);
        });
    };
    $scope.removeOffer = function (offer) {
        Offer.delete({id: offer._id});
        
        var index = this.offers.indexOf(offer);
        $scope.offers.splice(index, 1);
    };
}

//
// Controller for editing the details of an Offer.
// This controler modifies only direct attributes of the offer.
// Attributes within associated objects (such as charges and merchandising)
// are handled by seporate controlers.
//
offerConfiguratorControllers.controller('OfferDetailsController', 
                                        ['$scope', 
                                         '$stateParams',
                                         'AppState',
                                         'Offer',
                                         OfferDetailsController]);
function OfferDetailsController($scope, $stateParams, AppState, Offer) {
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Update Application State.
    AppState.currOffer = $scope.offer;
    AppState.showGotoOffers = true;
    AppState.showGotoOffer = false;
    
    // Get OfferType and OfferStatus enum listings (for dropdowns)
    $scope.offerTypes = AppState.offerTypes;
    $scope.offerStatuses = AppState.offerStatuses;
    
    //
    // Supported opperations.
    //
    $scope.progressOfferStatus = function () {
        // Progress the offer status to it's next allowable status.
        $scope.offer.offerStatus = AppState.getOfferStatus($scope.offer.offerStatus.nextStatus);
    }
    $scope.setOfferType = function (offerType) {
        $scope.offer.offerType = offerType;
    };
    $scope.saveOffer = function () {
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
}

//
// Controller for adding/removing benefits to an offer.
// Adding a benefit to an offer is done by selecting a belefit from the 
// enumerated bemefits model collection, along with an actionType model.
// The chosen benefit (by way of it's id) is added to an array internal 
// to the offer.
//
offerConfiguratorControllers.controller('BenefitsController', 
                                        ['$scope', 
                                         '$stateParams',
                                         'AppState',
                                         'Offer',
                                         BenefitsController]);
function BenefitsController($scope, $stateParams, AppState, Offer) {
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Update the Application State.
    AppState.showGotoOffer = true;
    
    // Get Benefits.
    $scope.benefits = AppState.benefits;
    
    // Toggle remove benefits.
    $scope.removeBenefits = false;
    // Selected benefit to add.
    $scope.benefitToAdd = {};
    
    //
    // Supported opperations.
    //
    $scope.toggleRemoveBenefits = function () {
        $scope.removeBenefits = !$scope.removeBenefits;
    };
    $scope.removeBenefit = function (benefit) {
        var index = $scope.offer.benefits.indexOf(benefit);
        $scope.offer.benefits.splice(index, 1);
    }
    $scope.setBenefitToAdd = function (benefit) {
        $scope.benefitToAdd = benefit;
    };
    $scope.addBenefitToOffer = function () {        
        $scope.offer.benefits.push($scope.benefitToAdd);
    };
    $scope.saveBenefits = function () {
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
}

//
// Controller for adding/removing terms to an offer.
// Along with managing a table of terms within the offer, there are a few 
// top-level attributes that apply to all terms, kept within the 
// parent offer.
//
offerConfiguratorControllers.controller('TermsController', 
                                        ['$scope', 
                                         '$stateParams',
                                         'AppState',
                                         'Offer', 'Terms', 'Term',
                                         TermsController]);
function TermsController($scope, $stateParams, AppState, Offer, Terms, Term) {
    AppState.displayTerms = true;
    AppState.displayTermDetails = false;
    $scope.appState = AppState;
    
    // Update the Application State.
    AppState.showGotoOffer = true;
    
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });

    // Perform HTTP GET for all terms in the offer.
    $scope.terms = Terms.listByOffer({offerId: $stateParams.offerId}, function (terms) {
        for (var i=0; i<terms.length; i++) {
            var term = terms[i];
            
            if (term.hasBillingInterval) {
                term.reccurrenceDescription = "Every " + term.billingTimespan + " " + term.billingInterval.name + " for " + term.billingPeriod.name + " billing period(s)";
            }
            else {
                term.reccurrenceDescription = "None";
            }
        }
    });
    
    // Toggle edit terms.
    $scope.editTerms = false;
    // Toggle remove terms.
    $scope.removeTerms = false;

    
    //
    // Supported opperations.
    //
    $scope.toggleEditTerms = function () {
        $scope.editTerms = !$scope.editTerms;
    };
    $scope.toggleRemoveTerms = function () {
        $scope.removeTerms = !$scope.removeTerms;
    };
    $scope.addTerm = function () {
        // Create an term within the selected offer.
        // Set default values for billingOnset, billingInterval, recurrence and prorationRule.
        // All other fields can be modified on a REST update.
        var defaultBillingOnset = AppState.getBillingOnset(1);
        var defaultBillingInterval = AppState.getBillingInterval(1);
        var defaultBillingPeriod = AppState.getBillingPeriod(1);
        var defaultProrationRule = AppState.getProrationRule(1);
        
        var now = new Date();
        
        Term.create({offer:                 $scope.offer,
                     billingOnset:          defaultBillingOnset,
                     billingInterval:       defaultBillingInterval,
                     billingPeriod:         defaultBillingPeriod,
                     prorationRule:         defaultProrationRule,
                     isTrial:               false,
                     description:           "Term description here",
                     startDate:             now,
                     price:                 "$0.99",
                     msrp:                  "-",
                     hasBillingInterval:    true,
                     billingTimespan:       1,
                     frequency:             "Indefinite"},
                     function (term) {
            term.billingOnset = defaultBillingOnset;
            term.billingInterval = defaultBillingInterval;
            term.billingPeriod = defaultBillingPeriod;
            term.prorationRule = defaultProrationRule;
            term.reccurrenceDescription = "Every " + term.billingTimespan + " " + term.billingInterval.name + " for " + term.billingPeriod.name + " billing period(s)";
            $scope.terms.push(term);
            
            // Add term reference to the offer.
            $scope.offer.terms.push(term);
            AppState.currOffer.terms.push(term);
        });
    };
    $scope.removeTerm = function (term) {
        Term.delete({id: term._id});
        
        var index = $scope.terms.indexOf(term);
        $scope.terms.splice(index, 1);
    }

    $scope.saveTerms = function () {
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
}

//
// Controller for editing the details of a Term.
// This controler modifies only direct attributes of the term.
//
offerConfiguratorControllers.controller('TermDetailsController', 
                                        ['$scope',
                                         '$state',
                                         '$stateParams',
                                         'AppState',
                                         'Term',
                                         TermDetailsController]);
function TermDetailsController($scope, $state, $stateParams, AppState, Term) {
    // Flip the appState into terms detail.
    AppState.displayTerms = false;
    AppState.displayTermDetails = true;
    
    // Lookup the term by it's ID.
    $scope.term = Term.show({id:$stateParams.termId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Get BillingOnset, BillingInterval, Recurrence, and ProrationRule enum listings (for dropdowns)
    $scope.billingOnsets = AppState.billingOnsets;
    $scope.billingIntervals = AppState.billingIntervals;
    $scope.billingPeriods = AppState.billingPeriods;
    $scope.prorationRules = AppState.prorationRules;
    
    //
    // Supported opperations.
    //
    $scope.setBillingOnset = function (billingOnset) {
        $scope.term.billingOnset = billingOnset;
    };
    $scope.setBillingInterval = function (billingInterval) {
        $scope.term.billingInterval = billingInterval;
    };
    $scope.setBillingPeriod = function (billingPeriod) {
        $scope.term.billingPeriod = billingPeriod;
    };
    $scope.setProrationRule = function (prorationRule) {
        $scope.term.prorationRule = prorationRule;
    };
    $scope.saveTerm = function () {
        // Set the frequency from billingPeriod.name
        $scope.term.frequency = $scope.term.billingPeriod.name;
        
        Term.update({id: $scope.term._id}, $scope.term);
        
        // Go back to terms 
        $state.go('terms', {offerId: $scope.term.offer._id}, {reload: true});
    };
}

//
// Controller for adding/removing merchendising to an offer.
//
offerConfiguratorControllers.controller('OfferMerchandisingController', 
                                        ['$scope', 
                                         '$stateParams',
                                         'AppState',
                                         'Offer', 'Merchandising', 'Merchandise',
                                         OfferMerchandisingController]);
function OfferMerchandisingController($scope, $stateParams, AppState, Offer, Merchandising, Merchandise) {
    $scope.appState = AppState;
    
    // Update the Application State.
    AppState.showGotoOffer = true;
    
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });

    // Perform HTTP GET for all merchendising in the offer.
    $scope.merchandising = Merchandising.listByOffer({offerId: $stateParams.offerId});

    $scope.placements = AppState.placements;
    
    //
    // Supported opperations.
    //
    $scope.setPlacement = function (merch, placement) {
        merch.placement = placement;
    };
    $scope.addMerchandising = function () {
        var defaultPlacement = AppState.getPlacement(1);
        
        Merchandise.create({offer:                 $scope.offer,
                            placement:             defaultPlacement,
                            dataType:              2,
                            value:                 "Custom text here",
                            notes:                 "notes here"},
                            function (merchandise) {
            merchandise.placement = defaultPlacement;
            
            $scope.merchandising.push(merchandise);
        });
    };
    $scope.removeMerchandising = function (merchandise) {
        Merchandise.delete({id: merchandise._id});
        
        var index = $scope.merchandising.indexOf(merchandise);
        $scope.merchandising.splice(index, 1);
    }

    $scope.saveMerchandising = function () {
        for (var i=0; i<$scope.merchandising.length; i++) {
            var merch = $scope.merchandising[i];
            
            Merchandise.update({id: merch._id}, merch);
        }
    };
}