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
    'use strict';
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
            var credentials = {username: $scope.username, password: $scope.password};
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
    'use strict';
    $scope.appState = AppState;
    
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
    $scope.logout = function () {
        AppState.logout();
    };
}

//
// Controls add/remove/edit of populations. 
// On edit of a population, will route to the PopulationDetailsController,
// passing the populationId.
//
offerConfiguratorControllers.controller('PopulationsController', ['$scope', '$state', 'AppState', 'AppUtility', 'IntegralUITreeGridService', 'Populations', 'Population', 'SegmentExpression', 'Offer', 'OfferTypes', 'OfferStatuses', 'Benefits', 'ActionTypes', 'BillingOnsets', 'BillingIntervals', 'BillingPeriods', 'ProrationRules', 'MerchTypes', 'Placements', 'Dimensions', 'Ranges', 'Operators', PopulationsController]);
function PopulationsController($scope, $state, AppState, AppUtility, $gridService, Populations, Population, SegmentExpression, Offer, OfferTypes, OfferStatuses, Benefits, ActionTypes, BillingOnsets, BillingIntervals, BillingPeriods, ProrationRules, MerchTypes, Placements, Dimensions, Ranges, Operators) {
    'use strict';
    // Prefetch enumerations from the server here
    AppUtility.dimensions = Dimensions.list();
    AppUtility.ranges = Ranges.list();
    AppUtility.operators = Operators.list();
    AppUtility.offerTypes = OfferTypes.list();
    AppUtility.offerStatuses = OfferStatuses.list();
    AppUtility.benefits = Benefits.list();
    AppUtility.billingOnsets = BillingOnsets.list();
    AppUtility.billingIntervals = BillingIntervals.list();
    AppUtility.billingPeriods = BillingPeriods.list();
    AppUtility.prorationRules = ProrationRules.list();
    AppUtility.merchTypes = MerchTypes.list();
    AppUtility.placements = Placements.list();

    var tgWidth = $("#popTG").width();
    
    $scope.gridName = "populationsTreeGrid";
    $scope.columns = [
        {headerText: "Name", headerAlignment: "left", contentAlignment: "left", width: Math.round(tgWidth*0.2) },
        {headerText: "Type", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.15) },
        {headerText: "Split", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.1) },
        {headerText: "Status", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.15) },
        {headerText: "Start", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.19) },
        {headerText: "End", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.19) }
    ];
    $scope.rowData = [];
    
    // Fetch the populations from the server.
    $scope.populations = Populations.list(function (populations) {
        var i, j, pop, row, offers, offer, childRow;
        for (i = 0; i < populations.length; i += 1) {
            pop = populations[i];
            
            row = {dbObj: pop, dbType: "Population", cells: [{text: pop.name}]};
            $gridService.addRow($scope.gridName, row);
            
            // Insert any child offers of this population.
            offers = pop.offers;
            for (j = 0; j < offers.length; j += 1) {
                offer = offers[j];
                
                var startDate = new Date(offer.startDate);
                var endDate = new Date(offer.endDate);
                
                childRow = {dbObj: offer, dbType: "Offer", cells: [
                    {text: offer.name},
                    {text: offer.offerType.name},
                    {text: offer.split},
                    {text: offer.offerStatus.name},
                    {text: startDate.toDateString()},
                    {text: endDate.toDateString()}
                ]};
                
                $gridService.addRow($scope.gridName, childRow, row);
            }
        }
    });
    
    //
    // Supported Opperations
    //
    $scope.createPopulation = function () {
        Population.create(function (pop) {
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
            var parentRow = $gridService.getRowParent($scope.gridName, row);
            
            // Update the Application State.
            AppState.showGotoPopulation = true;
            AppState.currPopulationId = parentRow.dbObj._id;
            
            $state.go('offerDetails', {offerId: row.dbObj._id});
        }
    };
    $scope.copyPopulation = function () {
        var selectedRow = $gridService.selectedRow($scope.gridName);
        
        if (selectedRow.dbType == "Population") {
            var selectedPop = selectedRow.dbObj;
            
            Population.create(function (pop) {
                pop.name = selectedPop.name;
                
                // Copy the segment definition.
                var exCreateCount = 0;
                for (var i=0; i<selectedPop.segmentExpression.length; i++) {
                    var ex = selectedPop.segmentExpression[i];
                    
                    SegmentExpression.show({id: ex._id}, function (expression){
                        SegmentExpression.create({population:       pop,
                                                  operatorOnly:     expression.operatorOnly,
                                                  left:             expression.left,
                                                  operator:         expression.operator,
                                                  right:            expression.right}, 
                                                 function(newExpression) {
                            pop.segmentExpression.push(newExpression);

                            exCreateCount += 1;
                            if (exCreateCount == selectedPop.segmentExpression.length) {
                                Population.update({id:pop._id}, pop);
                            }
                        });
                    });
                }
                
                if (selectedPop.segmentExpression.length == 0) {
                    Population.update({id:pop._id}, pop);
                }
                
                var newRow = {dbObj: pop, dbType: "Population", cells: [{text: pop.name}]};
                $gridService.insertRowAfter($scope.gridName, newRow, selectedRow);
            });
        }
    };
}

//
// Controls editing population details.
// Containes logical population segment expression builder that acts as 
// a means to characterize a group of people.
// 
offerConfiguratorControllers.controller('PopulationDetailsController', 
                                        ['$scope', '$state', '$stateParams', 'AppState', 'AppUtility', 'Population', 'SegmentExpression',
                                         PopulationDetailsController]);
function PopulationDetailsController($scope, $state, $stateParams, AppState, AppUtility, Population, SegmentExpression) {
    // Lookup the population by it's ID.
    Population.show({id:$stateParams.populationId}, function(population){
        // Update Application State.
        AppState.currPopulationId = population._id;
        
        $scope.population = population;
        // Populate each of the expressions within the segment definition.
        for (var i=0; i < population.segmentExpression.length; i++) {
            var ex = population.segmentExpression[i];
            SegmentExpression.show({id: ex._id}, function (expression){
                expression.applicableRanges = AppUtility.getApplicableRangesInDimension(expression.left);
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
    
    $scope.supportedDimensions = AppUtility.dimensions;
    
    // When a dimension is chosen for an expression, the range must be updated
    // so as not to specify the range of a different dimension.
    $scope.setDimension = function (expression, dimension) {
        expression.left = dimension;
        expression.applicableRanges = AppUtility.getApplicableRangesInDimension(dimension);
        expression.right = expression.applicableRanges[0];
        
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Ensure currect operator is set into expression.
    $scope.setOperator = function (expression, operatorId) {
        expression.operator = AppUtility.getOperator(operatorId);
        
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Save changes to the range.
    $scope.setRange = function(expression, range) {
        expression.right = range;
        SegmentExpression.update({id: expression._id}, expression);
    };
    // Add a new expression to the segment expression.
    $scope.addExpression = function () {
        var defaultDimension = AppUtility.getDimension(1);
        var defaultOperator = AppUtility.getOperator(1);
        var defaultRange = AppUtility.getApplicableRangesInDimension(defaultDimension)[0];
        
        // If there is at least one expression, add an outer operator first
        if ($scope.population.segmentExpression.length > 0) {
            SegmentExpression.create({population:       $scope.population,
                                      operatorOnly:     true,
                                      left:             defaultDimension,
                                      operator:         AppUtility.getOperator(3),
                                      right:            defaultRange}, 
                                     function(expression) {
                expression.left = defaultDimension; // ignored
                expression.operator = AppUtility.getOperator(3);
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
            expression.applicableRanges = AppUtility.getApplicableRangesInDimension(defaultDimension);
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
    $scope.gotoPopulations = function () {
        AppState.showGotoPopulation = false;
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('populations');
    };
}

//
// Controller for adding/removing Offers.
//
offerConfiguratorControllers.controller('OffersController', 
                                        ['$scope',
                                         '$state',
                                         '$stateParams',
                                         'IntegralUITreeGridService',
                                         '$modal',
                                         'AppState',
                                         'AppUtility',
                                         'Population',
                                         'Offers', 'Offer',
                                         OffersController]);
function OffersController($scope, $state, $stateParams, $gridService, $modal, AppState, AppUtility, Population, Offers, Offer) {
    // Update the Application State.
    AppState.showGotoPopulation = true;
    
    var tgWidth = $("#offerTG").width();
    
    $scope.gridName = "offersTreeGrid";
    $scope.columns = [
        {headerText: "Name", headerAlignment: "left", contentAlignment: "left", width: Math.round(tgWidth*0.2) },
        {headerText: "Type", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.15) },
        {headerText: "Split", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.1) },
        {headerText: "Status", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.15) },
        {headerText: "Start", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.19) },
        {headerText: "End", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.19) }
    ];
    $scope.rowData = [];
    
    // Lookup the population by it's ID.
    $scope.population = Population.show({id: $stateParams.populationId});
    // Perform HTTP GET for all offers in the population.
    Offers.listByPopulation({populationId: $stateParams.populationId}, function(offers){
        for (var i=0; i<offers.length; i++) {
            var offer = offers[i];
            var id = i+1;
            var startDate = new Date(offer.startDate);
            var endDate = new Date(offer.endDate);
            
            var row = {dbObj:offer, id: id, cells:[
                {value: "name", text: offer.name},
                {value: "offerType", text: offer.offerType.name},
                {value: "split", text: offer.split, labelEdit: true},
                {value: "offerStatus", text: offer.offerStatus.name},
                {value: "startDate", text: startDate.toDateString()},
                {value: "endDate", text: endDate.toDateString()}
            ]};
            $gridService.addRow($scope.gridName, row);
        }
    }, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    //
    // Supported opperations.
    //
    $scope.createOffer = function () {
        // Create an offer within the selected population.
        // Set default values for offerStatus and offerType.
        // All other fields can be modified on a REST update.
        var defaultStatus = AppUtility.getOfferStatus(1);
        var defaultOfferType = AppUtility.getOfferType(1);
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
                      paymentAuthorizationAmount:       0,
                      shortPaymentDisclosure:           "short payment disclosure",
                      longPaymentDisclosure:            "long payment disclosure"},
                     function (offer) {
            offer.offerStatus = defaultStatus;
            offer.offerType = defaultOfferType;
            var startDate = new Date(offer.startDate);
            var endDate = new Date(offer.endDate);
            
            var row = {dbObj: offer, cells:[
                {value: "name", text: offer.name},
                {value: "offerType", text: offer.offerType.name},
                {value: "split", text: offer.split, labelEdit: true},
                {value: "offerStatus", text: offer.offerStatus.name},
                {value: "startDate", text: startDate.toDateString()},
                {value: "endDate", text: endDate.toDateString()}
            ]};
            $gridService.addRow($scope.gridName, row);
        });
    };
    $scope.remove = function () {
        var row = $gridService.selectedRow($scope.gridName);

        $gridService.removeRow($scope.gridName,  row);
        
        Offer.delete({id: row.dbObj._id});
    };
    $scope.edit = function (offer) {
        var row = $gridService.selectedRow($scope.gridName);
        $state.go('offerDetails', {offerId: row.dbObj._id});
    };
    $scope.rowEdited = function (e) {
        var row = $gridService.selectedRow($scope.gridName);
        var offer = row.dbObj;
        
        if (e.cell.value == "split") {
            e.cell.text = AppUtility.validateSplit(e.cell.text);
            
            if (e.cell.text !== offer.split) {
                offer.split = e.cell.text;
                Offer.update({id: offer._id}, offer);
            }
        }
        else if (e.cell.value == "name") {
            offer.name = e.cell.text;
            Offer.update({id: offer._id}, offer);
        }
        else {
            if (e.cell.value == "offerType") {
                e.cell.text = offer.offerType.name;
            }
            else if (e.cell.value == "offerStatus") {
                e.cell.text = offer.offerStatus.name;
            }
            else if (e.cell.value == "startDate") {
                var startDate = new Date(offer.startDate);
                e.cell.text = startDate.toDateString();
            }
            else if (e.cell.value == "endDate") {
                var endDate = new Date(offer.endDate);
                e.cell.text = endDate.toDateString();
            }
        }
    };
    $scope.copy = function () {
        var modalInstance = $modal.open({
            templateUrl: 'templates/copy-offer.html',
            controller: 'CopyOfferController',
            size: 'lg'
        });

        // Copy the offer into the current population.
        modalInstance.result.then(function (selectedOffer) {
            AppUtility.copyOffer($scope.population, selectedOffer, function(offer) {
                var startDate = new Date(offer.startDate);
                var endDate = new Date(offer.endDate);
                
                var newRow = {dbObj: offer, dbType: "Offer", cells: [
                    {value: "name", text: offer.name},
                    {value: "offerType", text: offer.offerType.name},
                    {value: "split", text: offer.split, labelEdit: true},
                    {value: "offerStatus", text: offer.offerStatus.name},
                    {value: "startDate", text: startDate.toDateString()},
                    {value: "endDate", text: endDate.toDateString()}
                ]};
                $gridService.addRow($scope.gridName, newRow);
            });
        });
    };
    $scope.gotoPopulations = function () {
        AppState.showGotoPopulation = false;
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('populations');
    };
}

offerConfiguratorControllers.controller('CopyOfferController', 
                                        ['$scope',
                                         '$modalInstance',
                                         'IntegralUITreeGridService',
                                         'Populations',
                                         CopyOfferController]);
function CopyOfferController($scope, $modalInstance, $gridService, Populations) {
    $scope.gridName = "copyOfferTreeGrid";
    $scope.columns = [
        {headerText: "Name", headerAlignment: "left", contentAlignment: "left", width: 495 }
    ];
    $scope.rowData = [];
    
    Populations.list(function (populations) {
        var i, j, pop, row, offers, offer, childRow;
        for (i = 0; i < populations.length; i += 1) {
            pop = populations[i];
            
            row = {dbObj: pop, dbType: "Population", cells: [{text: pop.name}]};
            $gridService.addRow($scope.gridName, row);
            
            // Insert any child offers of this population.
            offers = pop.offers;
            for (j = 0; j < offers.length; j += 1) {
                offer = offers[j];

                childRow = {dbObj: offer, dbType: "Offer", cells: [{text: offer.name}]};
                $gridService.addRow($scope.gridName, childRow, row);
            }
        }
    });
    
    $scope.ok = function () {
        var selectedRow = $gridService.selectedRow($scope.gridName);
        
        if (selectedRow.dbType == "Offer") {
            $modalInstance.close(selectedRow.dbObj);
        }
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
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
                                         '$state',
                                         '$stateParams',
                                         'AppState',
                                         'AppUtility',
                                         'Offer',
                                         OfferDetailsController]);
function OfferDetailsController($scope, $state, $stateParams, AppState, AppUtility, Offer) {
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
    $scope.offerTypes = AppUtility.offerTypes;
    $scope.offerStatuses = AppUtility.offerStatuses;
    
    //
    // Supported opperations.
    //
    $scope.progressOfferStatus = function () {
        // Progress the offer status to it's next allowable status.
        $scope.offer.offerStatus = AppUtility.getOfferStatus($scope.offer.offerStatus.nextStatus);
        Offer.update({id: $scope.offer._id}, $scope.offer);
    }
    $scope.setOfferType = function (offerType) {
        $scope.offer.offerType = offerType;
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
    $scope.saveOffer = function () {
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('offers', {populationId: $scope.offer.population._id});
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
                                         '$state',
                                         '$stateParams',
                                         'AppState',
                                         'AppUtility',
                                         'Offer',
                                         'IntegralUITreeGridService',
                                         BenefitsController]);
function BenefitsController($scope, $state, $stateParams, AppState, AppUtility, Offer, $gridService) {
    // Update the Application State.
    AppState.showGotoOffer = true;
    
    // Get all available benefits.
    $scope.availableBenefits = AppUtility.benefits;
    
    $scope.assignedBenefitsGrid = "assignedBenefits";
    $scope.availableBenefitsGrid = "availableBenefits";
    $scope.leftColumns = [
        { id: 1, headerText: "Assigned Benefits", headerAlignment: "center", contentAlignment: "center", width: 245 },
    ];
    $scope.rightColumns = [
        { id: 1, headerText: "Available Benefits", headerAlignment: "center", contentAlignment: "center", width: 245 },
    ];
    $scope.assignedBenefitsRows = [];
    $scope.availableBenefitsRows = [];
    
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(offer){
        for (var i=0; i<$scope.availableBenefits.length; i++) {
            var availBene = $scope.availableBenefits[i];
            
            var row = {dbObj:availBene, cells:[{text: availBene.name}]};
            
            // If the benefit is assgined to the offer, put in the
            // and assignedBenefies and not the availableBenefits.
            var benefitAssigned = false;
            for (var j=0; j<offer.benefits.length; j++) {
                var assignedBene = offer.benefits[j];
                 
                if (availBene._id == assignedBene._id) {
                    benefitAssigned = true;
                    $gridService.addRow($scope.assignedBenefitsGrid, row);
                    break;
                }
            }
            
            if (!benefitAssigned) {
                $gridService.addRow($scope.availableBenefitsGrid, row);
            }
        }
    }, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });
    
    //
    // Supported opperations.
    //
    $scope.addBenefit = function () {
        var row = $gridService.selectedRow($scope.availableBenefitsGrid);
        $gridService.addRow($scope.assignedBenefitsGrid, row);
        $gridService.removeRow($scope.availableBenefitsGrid, row);
        
        $scope.offer.benefits.push(row.dbObj);
        Offer.update({id: $scope.offer._id}, $scope.offer);
    }
    $scope.removeBenefit = function () {
        var row = $gridService.selectedRow($scope.assignedBenefitsGrid);
        $gridService.addRow($scope.availableBenefitsGrid, row);
        $gridService.removeRow($scope.assignedBenefitsGrid, row);
        
        var index = $scope.offer.benefits.indexOf(row.dbObj);
        $scope.offer.benefits.splice(index, 1);
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
    
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('offers', {populationId: $scope.offer.population._id});
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
                                         '$state',
                                         '$stateParams',
                                         'AppState',
                                         'AppUtility',
                                         'IntegralUITreeGridService',
                                         'Offer', 'Terms', 'Term',
                                         TermsController]);
function TermsController($scope, $state, $stateParams, AppState, AppUtility, $gridService, Offer, Terms, Term) {
    AppState.displayTerms = true;
    AppState.displayTermDetails = false;
    $scope.appState = AppState;
    
    // Update the Application State.
    AppState.showGotoOffer = true;
    
    var tgWidth = $("#chargesTG").width();
    
    $scope.gridName = "chargesTreeGrid";
    $scope.columns = [
        {headerText: "Billing Onset", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.25) },
        {headerText: "Amount", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.20) },
        {headerText: "MSRP", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.20) },
        {headerText: "Reccurence", headerAlignment: "center", contentAlignment: "center", width: Math.round(tgWidth*0.34) }
    ];
    $scope.rowData = [];
    
    // Lookup the offer by it's ID.
    $scope.offer = Offer.show({id:$stateParams.offerId}, function(d){}, function(err) {
        if (err.status === 401) {
            AppState.logout();
        }
    });

    // Perform HTTP GET for all terms in the offer.
    Terms.listByOffer({offerId: $stateParams.offerId}, function (terms) {
        for (var i=0; i<terms.length; i++) {
            var term = terms[i];
            var id = i+1;
            
            if (term.hasBillingInterval) {
                term.reccurrenceDescription = "Every " + term.billingTimespan + " " + term.billingInterval.name + " for " + term.billingPeriod.name + " billing period(s)";
            }
            else {
                term.reccurrenceDescription = "None";
            }
            
            var row = {dbObj:term, id: id, cells:[
                {value: "billingOnset", text: term.billingOnset.name},
                {value: "price", text: term.price},
                {value: "msrp", text: term.msrp},
                {value: "reccurrenceDescription", text: term.reccurrenceDescription}
            ]};
            $gridService.addRow($scope.gridName, row);
        }
    });
    
    //
    // Supported opperations.
    //
    $scope.createTerm = function () {
        // Create an term within the selected offer.
        // Set default values for billingOnset, billingInterval, recurrence and prorationRule.
        // All other fields can be modified on a REST update.
        var defaultBillingOnset = AppUtility.getBillingOnset(1);
        var defaultBillingInterval = AppUtility.getBillingInterval(1);
        var defaultBillingPeriod = AppUtility.getBillingPeriod(1);
        var defaultProrationRule = AppUtility.getProrationRule(1);
        
        var now = new Date();
        
        Term.create({offer:                 $scope.offer,
                     billingOnset:          defaultBillingOnset,
                     billingInterval:       defaultBillingInterval,
                     billingPeriod:         defaultBillingPeriod,
                     prorationRule:         defaultProrationRule,
                     isTrial:               false,
                     description:           "Term description here",
                     startDate:             now,
                     price:                 0.99,
                     msrp:                  0,
                     hasBillingInterval:    true,
                     billingTimespan:       1,
                     frequency:             "Indefinite"},
                     function (term) {
            term.billingOnset = defaultBillingOnset;
            term.billingInterval = defaultBillingInterval;
            term.billingPeriod = defaultBillingPeriod;
            term.prorationRule = defaultProrationRule;
            term.reccurrenceDescription = "Every " + term.billingTimespan + " " + term.billingInterval.name + " for " + term.billingPeriod.name + " billing period(s)";
            
            var row = {dbObj:term, cells:[
                {value: "billingOnset", text: term.billingOnset.name},
                {value: "price", text: term.price},
                {value: "msrp", text: term.msrp},
                {value: "reccurrenceDescription", text: term.reccurrenceDescription}
            ]};
            $gridService.addRow($scope.gridName, row);
            
            // Add term reference to the offer.
            $scope.offer.terms.push(term);
            Offer.update({id: $scope.offer._id}, $scope.offer);
        });
    };
    $scope.editTerm = function () {
        var row = $gridService.selectedRow($scope.gridName);
        $state.go('terms.termDetails', {termId: row.dbObj._id});
    };
    $scope.removeTerm = function () {
        var row = $gridService.selectedRow($scope.gridName);
        $gridService.removeRow($scope.gridName,  row);
        
        Term.delete({id: row.dbObj._id});
    }
    $scope.saveTerms = function () {
        // Ensure payment auth amount is a monitary value.
        $scope.offer.paymentAuthorizationAmount = 
            AppUtility.validateMonitaryAmount($scope.offer.paymentAuthorizationAmount);
        
        Offer.update({id: $scope.offer._id}, $scope.offer);
    };
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('offers', {populationId: $scope.offer.population._id});
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
                                         'AppUtility',
                                         'Term',
                                         TermDetailsController]);
function TermDetailsController($scope, $state, $stateParams, AppState, AppUtility, Term) {
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
    $scope.billingOnsets = AppUtility.billingOnsets;
    $scope.billingIntervals = AppUtility.billingIntervals;
    $scope.billingPeriods = AppUtility.billingPeriods;
    $scope.prorationRules = AppUtility.prorationRules;
    
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
        // Ensure monitary amounts are valid.
        $scope.term.price = AppUtility.validateMonitaryAmount($scope.term.price);
        $scope.term.msrp = AppUtility.validateMonitaryAmount($scope.term.msrp);
        
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
                                         '$state',
                                         '$stateParams',
                                         'AppState',
                                         'AppUtility',
                                         'Offer', 'Merchandising', 'Merchandise',
                                         OfferMerchandisingController]);
function OfferMerchandisingController($scope, $state, $stateParams, AppState, AppUtility, Offer, Merchandising, Merchandise) {
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

    $scope.placements = AppUtility.placements;
    $scope.merchTypes = AppUtility.merchTypes;
    
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
        var defaultMerchType = AppUtility.getMerchType(1);
        var defaultPlacement = AppUtility.getPlacement(1);
        
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
    $scope.gotoOffers = function () {
        AppState.showGotoOffers = false;
        AppState.showGotoOffer = false;
        $state.go('offers', {populationId: $scope.offer.population._id});
    };
}
