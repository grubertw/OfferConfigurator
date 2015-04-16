//
// file: api.js
//
// Defines RESTfull api presented to client.  All HTTP urls the the api 
// are accessed with /api/...
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.ObjectId;
var console = require('console');
var fs = require('fs');
var jwt = require('jsonwebtoken');
var validateJWT = require('express-jwt');

// Include model definitions.
var User = require(__dirname + '/models/User.js');
var Session = require(__dirname + '/models/Session.js');
var Privilege = require(__dirname + '/models/Privilege.js');
var Population = require(__dirname + '/models/Population.js');
var SegmentExpression = require(__dirname + '/models/SegmentExpression.js');
var Dimension = require(__dirname + '/models/Dimension.js');
var Range = require(__dirname + '/models/Range.js');
var Operator = require(__dirname + '/models/Operator.js');
var OfferType = require(__dirname + '/models/OfferType.js');
var OfferStatus = require(__dirname + '/models/OfferStatus.js');
var Offer = require(__dirname + '/models/Offer.js');
var Term = require(__dirname + '/models/Term.js');
var Benefit = require(__dirname + '/models/Benefit.js');
var BillingOnset = require(__dirname + '/models/BillingOnset.js');
var BillingInterval = require(__dirname + '/models/BillingInterval.js');
var Recurrence = require(__dirname + '/models/Recurrence.js');
var ProrationRule = require(__dirname + '/models/ProrationRule.js');
var ActionType = require(__dirname + '/models/ActionType.js');

// Load private RSA key for creation of the JWT token.
var privKey = fs.readFileSync('server/priv_key.pem');
var pubKey = fs.readFileSync('server/pub_key.pem');

// Prepend this route to all HTTP CRUD operations.
// (except autentication)
var apiRoute = "/api/";

// export the JWT token validator for use in every API call.
module.exports.validateJWT = validateJWT({secret: pubKey, credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring (req) {
      //console.log("Validating JWT token %s", req.headers.authorization);
      if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
          return req.headers.authorization.split(' ')[1];
      } else if (req.query && req.query.token) {    
          return req.query.token;
      }
      return null;
  }
});

//
// Group exports by Model.  Each export API has a url and method.
//
var AuthenticateAPI = {};
AuthenticateAPI.url = "/api/login";
AuthenticateAPI.login = function(req, res) {
    // Verify the user's password.
    User.findOne({username: req.body.username}, function (err, obj) {
        if (obj) {
            console.log("User %s found.", obj.username);
            
            if (obj.password == req.body.password) {
                var token = jwt.sign({firstName:obj.firstName,
                                      lastName:obj.lastName}, 
                                     privKey, {algorithm: 'RS256', expiresInMinutes:10});
                
                console.log("User password matches.  Sending JWT token: %s", token);

                res.json({token: token});
            }
            else 
                console.log("User password does not match.");
        }
        else 
            console.log("User %s not found.", req.body.username);
    });
}
module.exports.Authenticate = AuthenticateAPI;

//
// Population CRUD operations.
//
var PopulationAPI = {};
PopulationAPI.listUrl = apiRoute + "populations";
PopulationAPI.list = function(req, res) {    
    if (req.user) {
        console.log("JWT token is valid");
        
        Population.find({}, function(err, models) {
            res.send(models);
        });
    }
    else 
        console.log("JWT token is invalid");
};

PopulationAPI.showUrl = apiRoute + "population/:id";
PopulationAPI.show = function(req, res) {
    if (req.user) {
        Population.findOne({ _id: req.params.id }, function(err, model) {
            res.json(model.toJSON());
        });
    }
};


PopulationAPI.createUrl = apiRoute + "population";
PopulationAPI.create = function(req, res) {
    if (req.user) {
        var model = new Population({className: 'Population', name: 'New Population'});
        model.save();
        res.json(model.toJSON());
    }
}

PopulationAPI.updateUrl = apiRoute + "population/:id";
PopulationAPI.update = function(req, res) {
    if (req.user) {
        Population.findByIdAndUpdate(req.params.id, {
            $set: {name: req.body.name, statusId: req.body.statusId}
        }, { upsert: true }, function(err, model) {
            return res.json(model.toJSON());
        });
    }
}

PopulationAPI.deleteUrl = apiRoute + "population/:id";
PopulationAPI.delete = function(req, res) {
    if (req.user) {
        Population.remove({ _id: req.params.id }, function(err) {
            res.json(true);
        });
    }
};
module.exports.Population = PopulationAPI;

//
// Offer CRUD operations.
//
var OfferAPI = {};
OfferAPI.listByPopulationUrl = apiRoute + "offers/:populationId";
OfferAPI.listByPopulation = function(req, res) {    
    if (req.user) {
        Offer.find({population: req.params.populationId}).populate('offerType offerStatus population').exec(function(err, models) {
            res.send(models);
        });
    }
};

OfferAPI.showUrl = apiRoute + "offer/:id";
OfferAPI.show = function(req, res) {
    if (req.user) {
        Offer.findOne({ _id: req.params.id}).populate('offerType offerStatus population benefits').exec(function(err, model) {
            res.json(model.toJSON());
        });
    }
};


OfferAPI.createUrl = apiRoute + "offer";
OfferAPI.create = function(req, res) {
    if (req.user) {
        var model = new Offer({className: 'Offer', name: 'New Offer'});
        model.population = req.body.population._id; // An Offer must be created with a population, minimum.
        model.offerStatus = req.body.offerStatus._id;
        model.offerType = req.body.offerType._id;
        model.description = "offer description here";
        model.startDate = new Date();
        model.endDate = new Date();
        model.benefits = [];
        model.terms = [];
        
        // Fields that apply to all terms/changes
        model.requiresPaymentAuthorization = false;
        model.paymentAuthorizationAmount = "$0.0";
        model.shortPaymentDisclosure = "short payment disclosure";
        model.longPaymentDisclosure = "long payment disclosure";
        
        model.save(function(err) {
            res.json(model.toJSON());
        });
        
    }
}

OfferAPI.updateUrl = apiRoute + "offer/:id";
OfferAPI.update = function(req, res) {
    if (req.user) {
        // Extract the benefitId's from the Benefit objects.
        var benefits = [];
        for (var i=0; i<req.body.benefits.length; i++) {
            benefits.push(req.body.benefits[i]._id);
        }
        
        // Extract the termId's from the Term objects.
        // MOTE: For terms to be insered properly here, they must
        // already exist within the terms table.
        var terms = [];
        for (var i=0; i<req.body.terms.length; i++) {
            terms.push(req.body.terms[i]._id);
        }
        
        Offer.findByIdAndUpdate(req.params.id, {
            $set: {name:                        req.body.name, 
                   offerType:                   req.body.offerType._id, 
                   offerStatus:                 req.body.offerStatus._id,
                   description:                 req.body.description,
                   startDate:                   req.body.startDate,
                   endDate:                     req.body.endDate,
                   requiresPaymentAuthorization:req.bosy.requiresPaymentAuthorization,
                   paymentAuthorizationAmount:  req.body.paymentAuthorizationAmount,
                   shortPaymentDisclosure:      req.body.shortPaymentDisclosure,
                   longPaymentDisclosure:       req.body.longPaymentDisclosure,
                   benefits:                    benefits,
                   terms:                       terms}
        }, { upsert: true }, function(err, model) {
            console.log("Update Offer  err=%s", err);
            
            return res.json(model.toJSON());
        });
    }
}

OfferAPI.deleteUrl = apiRoute + "offer/:id";
OfferAPI.delete = function(req, res) {
    if (req.user) {
        Offer.remove({ _id: req.params.id }, function(err) {
            res.json(true);
        });
    }
};
module.exports.Offer = OfferAPI;

//
// Term CRUD operations.
//
var TermAPI = {};
TermAPI.listByOfferUrl = apiRoute + "terms/:offerId";
TermAPI.listByOffer = function(req, res) {    
    if (req.user) {
        Term.find({offer: req.params.offerId}).populate('recurrence offer').exec(function(err, models) {
            res.send(models);
        });
    }
};

TermAPI.showUrl = apiRoute + "term/:id";
TermAPI.show = function(req, res) {
    if (req.user) {
        Term.findOne({ _id: req.params.id}).populate('recurrence prorationRule offer').exec(function(err, model) {
            res.json(model.toJSON());
        });
    }
};

TermAPI.createUrl = apiRoute + "term";
TermAPI.create = function(req, res) {
    if (req.user) {
        var model = new Term({className: 'Term', name: 'New Term'});
        model.offer = req.body.offer._id; // A Term must be created with an offer, minimum.
        model.billingOnset = req.body.billingOnset._id;
        model.billingInterval = req.body.billingInterval._id;
        model.recurrence = req.body.recurrence._id;
        model.prorationRule = req.body.prorationRule._id;
        model.isTrial = false;
        model.description = "Term description here";
        model.startDate = new Date();
        model.price = "$0.99";
        model.msrp = "";
        model.hasBillingInterval = true;
        
        // Set this to recurrence.name
        model.frequency = "Indefinite";
        
        // Set this to billingInterval.name
        model.billingPeriod = "Monthly";
        
        model.save(function(err) {
            res.json(model.toJSON());
        });
    }
}

TermAPI.updateUrl = apiRoute + "term/:id";
TermAPI.update = function(req, res) {
    if (req.user) {
        Term.findByIdAndUpdate(req.params.id, {
            $set: {name:                        req.body.name, 
                   billingOnset:                req.body.billingOnset._id, 
                   billingInterval:             req.body.billingInterval._id,
                   recurrence:                  req.body.recurrence._id,
                   prorationRule:               req.body.prorationRule._id,
                   isTrial:                     req.body.isTrial,
                   description:                 req.body.description,
                   startDate:                   req.body.startDate,
                   price:                       req.body.price,
                   msrp:                        req.body.msrp,
                   hasBillingInterval:          req.body.hasBillingInterval,
                   frequency:                   req.body.frequency,
                   billingPeriod:               req.body.billingPeriod}
        }, { upsert: true }, function(err, model) {
            console.log("Update Offer  err=%s", err);
            
            return res.json(model.toJSON());
        });
    }
}

TermAPI.deleteUrl = apiRoute + "term/:id";
TermAPI.delete = function(req, res) {
    if (req.user) {
        Term.remove({ _id: req.params.id }, function(err) {
            res.json(true);
        });
    }
};
module.exports.Term = TermAPI;

// OfferType (enum)
var OfferTypeAPI = {}
OfferTypeAPI.listUrl = apiRoute + "offerTypes";
OfferTypeAPI.list = function(req, res) {
    if (req.user) {
        OfferType.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.OfferType = OfferTypeAPI;

// OfferStatus (enum)
var OfferStatusAPI = {}
OfferStatusAPI.listUrl = apiRoute + "offerStatuses";
OfferStatusAPI.list = function(req, res) {
    if (req.user) {
        OfferStatus.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.OfferStatus = OfferStatusAPI;

// Benefit (enum)
var BenefitAPI = {}
BenefitAPI.listUrl = apiRoute + "benefits";
BenefitAPI.list = function(req, res) {
    if (req.user) {
        Benefit.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.Benefit = BenefitAPI;

// ActionType (enum)
var ActionTypeAPI = {}
ActionTypeAPI.listUrl = apiRoute + "actionTypes";
ActionTypeAPI.list = function(req, res) {
    if (req.user) {
        ActionType.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.ActionType = ActionTypeAPI;

// BillingOnset (enum)
var BillingOnsetAPI = {}
BillingOnsetAPI.listUrl = apiRoute + "billingOnsets";
BillingOnsetAPI.list = function(req, res) {
    if (req.user) {
        BillingOnset.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.BillingOnset = BillingOnsetAPI;

// BillingInterval (enum)
var BillingIntervalAPI = {}
BillingIntervalAPI.listUrl = apiRoute + "billingIntervals";
BillingIntervalAPI.list = function(req, res) {
    if (req.user) {
        BillingInterval.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.BillingInterval = BillingIntervalAPI;

// Recurrence (enum)
var RecurrenceAPI = {}
RecurrenceAPI.listUrl = apiRoute + "recurrences";
RecurrenceAPI.list = function(req, res) {
    if (req.user) {
        Recurrence.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.Recurrence = RecurrenceAPI;

// ProrationRule (enum)
var ProrationRuleAPI = {}
ProrationRuleAPI.listUrl = apiRoute + "prorationRules";
ProrationRuleAPI.list = function(req, res) {
    if (req.user) {
        ProrationRule.find({}, function(err, models) {
            res.send(models);
        });
    }
};
module.exports.ProrationRule = ProrationRuleAPI;