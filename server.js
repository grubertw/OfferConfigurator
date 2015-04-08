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

// OfferType (enum) (list)
app.get(api.OfferType.listUrl, api.validateJWT, api.OfferType.list);

// OfferStatus (enum) (list)
app.get(api.OfferStatus.listUrl, api.validateJWT, api.OfferStatus.list);

// Benefit (enum) (list)
app.get(api.Benefit.listUrl, api.validateJWT, api.Benefit.list);




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