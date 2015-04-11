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
var Benefit = require(__dirname + '/models/Benefit.js');

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
        Offer.find({populationId: req.params.populationId}, function(err, models) {
            res.send(models);
        });
    }
};

OfferAPI.showUrl = apiRoute + "offer/:id";
OfferAPI.show = function(req, res) {
    if (req.user) {
        Offer.findOne({ _id: req.params.id }, function(err, model) {
            res.json(model.toJSON());
        });
    }
};


OfferAPI.createUrl = apiRoute + "offer";
OfferAPI.create = function(req, res) {
    if (req.user) {
        var model = new Offer({className: 'Offer', name: 'New Offer'});
        model.populationId = req.body.populationId; // An Offer must be created with a populationId, minimum.
        model.statusId = req.body.statusId;
        model.offerTypeId = req.body.offerTypeId;
        
        model.save();
        res.json(model.toJSON());
    }
}

OfferAPI.updateUrl = apiRoute + "offer/:id";
OfferAPI.update = function(req, res) {
    if (req.user) {
        Offer.findByIdAndUpdate(req.params.id, {
            $set: {name:                        req.body.name, 
                   offerTypeId:                 req.body.offerTypeId, 
                   statusId:                    req.body.statusId,
                   description:                 req.body.description,
                   startDate:                   req.body.startDate,
                   endDate:                     req.body.endDate,
                   paymentAuthorizationAmount:  req.body.paymentAuthorizationAmount,
                   shortPaymentDisclosure:      req.body.shortPaymentDisclosure,
                   longPaymentDisclosure:       req.body.longPaymentDisclosure}
        }, { upsert: true }, function(err, model) {
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