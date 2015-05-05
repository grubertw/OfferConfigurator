//
// file: server.js
//
// This file uses node.js + express.js to serve up the offerConfigurator index page.
// For security purposee, login.html is served first, then when the user is authenticated
// and provided with a token, the index page is loaded.
//
// Routes are also setup for servacing HTTP GET requests made client-side.  Requests
// for data are handled using MondoDB's ORM (Object Relational Mapping). 
//
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var morgan = require('morgan');                     // log requests to the console (express4)
var bodyParser = require('body-parser');            // pull information from HTML POST (express4)
var methodOverride = require('method-override');    // simulate DELETE and PUT (express4)

app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));             // for parsing application/x-www-form-urlencoded
app.use(methodOverride());

// Connect to our database.
mongoose.connect('mongodb://localhost/offerConfigurator');

//
// Setup the RESTfull API to be utilized by the single-page client app.
//
var api = require(__dirname + '/server/api.js');

// Authenticate (login)
app.post(api.Authenticate.url, api.Authenticate.login);

// Population (list, show, create, update, delete)
app.get(api.Population.listUrl, api.validateJWT, api.Population.list);
app.get(api.Population.showUrl, api.validateJWT, api.Population.show);
app.post(api.Population.createUrl, api.validateJWT, api.Population.create);
app.put(api.Population.updateUrl, api.validateJWT, api.Population.update);
app.delete(api.Population.deleteUrl, api.validateJWT, api.Population.delete);

// Offer (list, show, create, update, delete)
app.get(api.Offer.listByPopulationUrl, api.validateJWT, api.Offer.listByPopulation);
app.get(api.Offer.showUrl, api.validateJWT, api.Offer.show);
app.post(api.Offer.createUrl, api.validateJWT, api.Offer.create);
app.put(api.Offer.updateUrl, api.validateJWT, api.Offer.update);
app.delete(api.Offer.deleteUrl, api.validateJWT, api.Offer.delete);

// Term (list, show, create, update, delete)
app.get(api.Term.listByOfferUrl, api.validateJWT, api.Term.listByOffer);
app.get(api.Term.showUrl, api.validateJWT, api.Term.show);
app.post(api.Term.createUrl, api.validateJWT, api.Term.create);
app.put(api.Term.updateUrl, api.validateJWT, api.Term.update);
app.delete(api.Term.deleteUrl, api.validateJWT, api.Term.delete);

// Merchendising (list, show, create, update, delete)
app.get(api.Merchendising.listByOfferUrl, api.validateJWT, api.Merchendising.listByOffer);
app.get(api.Merchendising.showUrl, api.validateJWT, api.Merchendising.show);
app.post(api.Merchendising.createUrl, api.validateJWT, api.Merchendising.create);
app.put(api.Merchendising.updateUrl, api.validateJWT, api.Merchendising.update);
app.delete(api.Merchendising.deleteUrl, api.validateJWT, api.Merchendising.delete);

// OfferType (enum) (list)
app.get(api.OfferType.listUrl, api.validateJWT, api.OfferType.list);

// OfferStatus (enum) (list)
app.get(api.OfferStatus.listUrl, api.validateJWT, api.OfferStatus.list);

// Benefit (enum) (list)
app.get(api.Benefit.listUrl, api.validateJWT, api.Benefit.list);

// ActionType (enum) (list)
app.get(api.ActionType.listUrl, api.validateJWT, api.ActionType.list);

// BillingOnset (enum) (list)
app.get(api.BillingOnset.listUrl, api.validateJWT, api.BillingOnset.list);

// BillingInterval (enum) (list)
app.get(api.BillingInterval.listUrl, api.validateJWT, api.BillingInterval.list);

// BillingPeriod (enum) (list)
app.get(api.BillingPeriod.listUrl, api.validateJWT, api.BillingPeriod.list);

// ProrationRule (enum) (list)
app.get(api.ProrationRule.listUrl, api.validateJWT, api.ProrationRule.list);

// Placement (enum) (list)
app.get(api.Placement.listUrl, api.validateJWT, api.Placement.list);

// This should be configured onto '/' last, for serving up
// file content within public.
app.use(express.static(__dirname + '/public'));

//
// Initilize the database.
//
var dbInit = require(__dirname + '/server/dbInit.js');
dbInit.initDb();

//
// Server startup.
//
app.listen(8080);