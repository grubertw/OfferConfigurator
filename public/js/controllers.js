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
        
        $state.go('populationDetails', {populationId: AppState.currPopulationId});
    };
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        
        $state.go('offers', {populationId: AppState.currPopulationId});
    };
    $scope.gotoSelectedOffer = function () {
        AppState.showGotoOffer = false;
        
        $state.go('offerDetails', {offerId: AppState.currOfferId});
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
                                        ['$scope', '$state', 'Populations', 'Population', 'AppState', 'IntegralUITreeGridService',
                                         'Offer', 'OfferTypes', 'OfferStatuses', 'Benefits', 'ActionTypes',
                                         'BillingOnsets', 'BillingIntervals', 'BillingPeriods', 'ProrationRules',
                                         'MerchTypes', 'Placements', 'Dimensions', 'Ranges', 'Operators',
                                         PopulationsController]);
function PopulationsController ($scope, $state, Populations, Population, AppState, $gridService,
                               Offer, OfferTypes, OfferStatuses, Benefits, ActionTypes,
                               BillingOnsets, BillingIntervals, BillingPeriods, 
                               ProrationRules, MerchTypes, Placements,
                               Dimensions, Ranges, Operators) {
    // Prefetch enumerations from the server here
    // FIXME:
    // This should be done in the login handler function,
    // but for some reason, angular has trouble injecting an updated 
    // AppState into the model REST services.
    AppState.dimensions = Dimensions.list();
    AppState.ranges = Ranges.list();
    AppState.operators = Operators.list();
    AppState.offerTypes = OfferTypes.list();
    AppState.offerStatuses = OfferStatuses.list();
    AppState.benefits = Benefits.list();
    AppState.billingOnsets = BillingOnsets.list();
    AppState.billingIntervals = BillingIntervals.list();
    AppState.billingPeriods = BillingPeriods.list();
    AppState.prorationRules = ProrationRules.list();
    AppState.merchTypes = MerchTypes.list();
    AppState.placements = Placements.list();
    
    $scope.gridName = "populationsTreeGrid";
    $scope.columns = [
        { id: 1, headerText: "Name", headerAlignment: "left", contentAlignment: "left", width: 180 },
        { id: 2, headerText: "Type", headerAlignment: "center", contentAlignment: "center", width: 125 },
        { id: 3, headerText: "Split", headerAlignment: "center", contentAlignment: "center", width: 60 },
        { id: 4, headerText: "Status", headerAlignment: "center", contentAlignment: "center", width: 105 },
        { id: 5, headerText: "Start", headerAlignment: "center", contentAlignment: "center", width: 160 },
        { id: 6, headerText: "End", headerAlignment: "center", contentAlignment: "center", width: 160 }
    ];
    
    $scope.rowData = [];
    
    // Fetch the populations from the server.
    $scope.populations = Populations.list(function (populations) {
        for (i=0; i<populations.length; i++) {
            var pop = populations[i];
            
            var row = {dbObj: pop, dbType: "Population", cells: [{text: pop.name}]};
            $gridService.addRow($scope.gridName, row);
            
            // Insert any child offers of this population.
            var offers = pop.offers;
            for (j=0; j<offers.length; j++) {
                var offer = offers[j];
                
                var childRow = {dbObj: offer, dbType: "Offer", cells: [
                    {text: offer.name}, 
                    {text: offer.offerType.name},
                    {text: offer.split},
                    {text: offer.offerStatus.name},
                    {text: offer.startDate},
                    {text: offer.endDate}
                ]};
                
                $gridService.addRow($scope.gridName, childRow, row);
            }
        }
    });
    
    //
    // Supported Opperations
    //
    $scope.createPopulation = function () {
        var newPopulation = Population.create(function(pop) {
            var row = {dbObj: pop, dbType: "Population", cells: [{text: pop.name}]};
            $gridService.addRow($scope.gridName, row);
        });
    };
    $scope.remove = function () {
        var row = $gridService.selectedRow($scope.gridName);
        $gridService.removeRow($scope.gridName,  row);
        
        if (row.dbType == "Population") {
            Population.delete({id: row.dbObj._id});
        }
        else if (row.dbType == "Offer") {
            Offer.delete({id: row.dbObj._id});
        }
        
    };
    $scope.edit = function () {
        var row = $gridService.selectedRow($scope.gridName);
        
        if (row.dbType == "Population") {
            $state.go('populationDetails', {populationId: row.dbObj._id});
        }
        else if (row.dbType == "Offer") {
            $state.go('offerDetails', {offerId: row.dbObj._id});
        }
    };
}

//
// Controls editing population details.
// Containes logical population segment expression builder that acts as 
// a means to characterize a group of people.
// 
offerConfiguratorControllers.controller('PopulationDetailsController', 
                                        ['$scope', '$stateParams', 'AppState', 'Population', 'SegmentExpression',
                                         PopulationDetailsController]);
function PopulationDetailsController($scope, $stateParams, AppState, Population, SegmentExpression) {
    // Lookup the population by it's ID.
    Population.show({id:$stateParams.populationId}, function(population){
        // Update Application State.
        AppState.currPopulationId = population._id;
        
        $scope.population = population;
        // Populate each of the expressions within the segment definition.
        for (var i=0; i < population.segmentExpression.length; i++) {
            var ex = population.segmentExpression[i];
            SegmentExpression.show({id: ex._id}, function (expression){
                expression.applicableRanges = AppState.getApplicableRangesInDimension(expression.left);
                // Expressions must be kept in the order they were created.
                for (var j=0; j < population.segmentExpression.length; j++) {
                    if (population.segmentExpression[j]._id == expression._id) {
                        population.segmentExpression[j] = expression;
                        break;
                    }
                }
            });
        }
    }, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    $scope.supportedDimensions = AppState.dimensions;
    
    // When a dimension is chosen for an expression, the range must be updated
    // so as not to specify the range of a different dimension.
    $scope.setDimension = function (expression, dimension) {
        expression.left = dimension;
        expression.applicableRanges = AppState.getApplicableRangesInDimension(dimension);
        expression.right = expression.applicableRanges[0];
        
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Ensure currect operator is set into expression.
    $scope.setOperator = function (expression, operatorId) {
        expression.operator = AppState.getOperator(operatorId);
        
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Save changes to the range.
    $scope.setRange = function(expression, range) {
        expression.right = range;
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Add a new expression to the segment expression.
    $scope.addExpression = function () {
        var defaultDimension = AppState.getDimension(1);
        var defaultOperator = AppState.getOperator(1);
        var defaultRange = AppState.getApplicableRangesInDimension(defaultDimension)[0];
        
        // If there is at least one expression, add an outer operator first
        if ($scope.population.segmentExpression.length > 0) {
            SegmentExpression.create({population:       $scope.population,
                                      operatorOnly:     true,
                                      left:             defaultDimension,
                                      operator:         AppState.getOperator(3),
                                      right:            defaultRange}, 
                                     function(expression) {
                expression.left = defaultDimension; // ignored
                expression.operator = AppState.getOperator(3);
                expression.right = defaultRange; // ignored
                $scope.population.segmentExpression.push(expression);
            });
        }
        
        SegmentExpression.create({population:       $scope.population,
                                  operatorOnly:     false,
                                  left:             defaultDimension,
                                  operator:         defaultOperator,
                                  right:            defaultRange}, 
                                 function(expression){
            expression.left = defaultDimension;
            expression.operator = defaultOperator;
            expression.right = defaultRange;
            expression.applicableRanges = AppState.getApplicableRangesInDimension(defaultDimension);
            $scope.population.segmentExpression.push(expression);
        });
    };
    // Removes the selected expression from the complete segment expression.
    $scope.removeExpression = function(expression) {
        var index = $scope.population.segmentExpression.indexOf(expression);
        if ($scope.population.segmentExpression.length > 1) {
            SegmentExpression.delete({id: $scope.population.segmentExpression[index-1]._id});
            $scope.population.segmentExpression.splice(index-1, 2); // Remove the outer operator AND the expression.
        }
        else {
            $scope.population.segmentExpression.splice(index, 1);
        }
        
        SegmentExpression.delete({id: expression._id});
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
    
    //
    // Supported opperations.
    //
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
                      split:                            0,
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
    $scope.saveOffer = function (offer) {
        Offer.update({id: offer._id}, offer);
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
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(offer){
        // Update Application State.
        AppState.currOfferId = offer._id;
        AppState.showGotoOffers = true;
        AppState.showGotoOffer = false;
    }, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    // Get OfferType and OfferStatus enum listings (for dropdowns)
    $scope.offerTypes = AppState.offerTypes;
    $scope.offerStatuses = AppState.offerStatuses;
    
    //
    // Supported opperations.
    //
    $scope.progressOfferStatus = function () {
        // Progress the offer status to it's next allowable status.
        $scope.offer.offerStatus = AppState.getOfferStatus($scope.offer.offerStatus.nextStatus);
        Offer.update({id: $scope.offer._id}, $scope.offer);
    }
    $scope.setOfferType = function (offerType) {
        $scope.offer.offerType = offerType;
        Offer.update({id: $scope.offer._id}, $scope.offer);
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
    
    // Selected benefit to add.
    $scope.benefitToAdd = {};
    
    //
    // Supported opperations.
    //
    $scope.removeBenefit = function (benefit) {
        var index = $scope.offer.benefits.indexOf(benefit);
        $scope.offer.benefits.splice(index, 1);
        Offer.update({id: $scope.offer._id}, $scope.offer);
    }
    $scope.setBenefitToAdd = function (benefit) {
        $scope.benefitToAdd = benefit;
    };
    $scope.addBenefitToOffer = function () {        
        $scope.offer.benefits.push($scope.benefitToAdd);
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
    
    //
    // Supported opperations.
    //
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
        Term.update({id: $scope.term._id}, $scope.term);
    };
    $scope.setBillingInterval = function (billingInterval) {
        $scope.term.billingInterval = billingInterval;
        Term.update({id: $scope.term._id}, $scope.term);
    };
    $scope.setBillingPeriod = function (billingPeriod) {
        $scope.term.billingPeriod = billingPeriod;
        Term.update({id: $scope.term._id}, $scope.term);
    };
    $scope.setProrationRule = function (prorationRule) {
        $scope.term.prorationRule = prorationRule;
        Term.update({id: $scope.term._id}, $scope.term);
    };
    $scope.saveTerm = function() {
        Term.update({id: $scope.term._id}, $scope.term);
    };
    $scope.backToTerms = function () {
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
    $scope.merchTypes = AppState.merchTypes;
    
    //
    // Supported opperations.
    //
    $scope.setPlacement = function (merch, placement) {
        merch.placement = placement;
        Merchandise.update({id: merch._id}, merch);
    };
    $scope.setMerchType = function (merch, type) {
        merch.merchType = type;
        Merchandise.update({id: merch._id}, merch);
    };
    $scope.addMerchandising = function () {
        var defaultMerchType = AppState.getMerchType(1);
        var defaultPlacement = AppState.getPlacement(1);
        
        Merchandise.create({offer:                 $scope.offer,
                            merchType:             defaultMerchType,
                            placement:             defaultPlacement,
                            value:                 "Custom text here",
                            notes:                 "notes here"},
                            function (merchandise) {
            merchandise.merchType = defaultMerchType;
            merchandise.placement = defaultPlacement;
            
            $scope.merchandising.push(merchandise);
        });
    };
    $scope.removeMerchandising = function (merchandise) {
        Merchandise.delete({id: merchandise._id});
        
        var index = $scope.merchandising.indexOf(merchandise);
        $scope.merchandising.splice(index, 1);
    }
    $scope.saveMerchandise = function (merch) {
        Merchandise.update({id: merch._id}, merch);
    };
}