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

                if (isVarified == 1) {
                    AppState.loggedIn = true;
                    AppState.authToken = token.token;
                                        
                    $state.go('populations');
                }
            });
        }
    };
}

//
// Controls header information.
// 
offerConfiguratorControllers.controller('HeaderController', ['$scope', 'AppState', HeaderController]);
function HeaderController($scope, AppState) {
    $scope.appState = AppState;
    
    // Controls the search
    // Also controls which tab panel is accessed, as a single
    // tab name may go to multiple destinations (such as Details)
    $scope.currentModelType = "Population";
    
    // Initialize models.
    models.setApplicableRangesInDimensions();
}

//
// Controls add/remove/edit of populations. 
// On edit of a population, will route to the PopulationDetailsController,
// passing the populationId.
//
offerConfiguratorControllers.controller('PopulationsController', 
                                        ['$scope', 'Populations', 'Population', 'AppState',
                                         'OfferTypes', 'OfferStatuses', 'Benefits', 'ActionTypes',
                                         PopulationsController]);
function PopulationsController($scope, Populations, Population, AppState, 
                               OfferTypes, OfferStatuses, Benefits, ActionTypes) {
    // Prefetch enumerations from the server here
    // FIXME:
    // This should be done in the login handler function,
    // but for some reason, angular has trouble injecting an updated 
    // AppState into the model REST services.
    AppState.offerTypes = OfferTypes.list();
    AppState.offerStatuses = OfferStatuses.list();
    AppState.benefits = Benefits.list();
    
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
                                        ['$scope', '$stateParams', 'Population',
                                         PopulationDetailsController]);
function PopulationDetailsController($scope, $stateParams, Population) {
    // Lookup the population by it's ID.
    $scope.population = Population.show({id:$stateParams.populationId});
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
    $scope.offers = Offers.listByPopulation({populationId: $stateParams.populationId});
    
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
        // Set default values for statusId and offerType.
        // All other fields can be modified on a REST update.
        var defaultStatus = AppState.getOfferStatus(1);
        var defaultOfferType = AppState.getOfferType(1);
        
        Offer.create({population:        $scope.population,
                      offerStatus:       defaultStatus,
                      offerType:         defaultOfferType},
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
    $scope.offer = Offer.show({id:$stateParams.offerId});
    
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
    $scope.offer = Offer.show({id:$stateParams.offerId});
    
    // Get Benefits and ActionTypes.
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
