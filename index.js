var http = require('http'),
    debug = require('debug')('http'),
    express = require('express'),
    path = require('path'),
    Mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    bodyParser = require('body-parser'),
    RocketController = require('./controllers/rocketController');


var mongoHost = 'localHost';
var mongoPort = 27017;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
var rocketController;

mongoClient.open(function(err, mongoClient) {
    if (!mongoClient) {
        console.error("Error! Exiting... Must start MongoDB first");
        process.exit(1);
    }
    var db = mongoClient.db("test");
    rocketController = new RocketController(db);
});

var app = express();
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(function(req, res, next) {
    console.log('%s @ %s: %s %s', req.headers.host, req.headers['x-real-ip'],
        req.method, req.url);
    next();
});

app.get('/', function (req, res) {
  res.send("ARIK RULES!!");
});

app.get('/rocket/manufacturer/:manufacturer', function(req, res) {
    rocketController.getManufacturer(req.params.manufacturer, function (err, rockets) {
        if (err) {
            res.send(400, err);
        }
        else {
            console.log(rockets);
            res.json(rockets);
        }
    })
});

app.get('/rocket/model/:model', function(req, res) {
    rocketController.getModel(req.params.model, function (err, rockets) {
        if (err) {
            res.send(400, err);
        }
        else {
            console.log(rockets);
             res.json(rockets);
        }
    })
});

app.post('/testDate/', function(req, res) {
    var db = mongoClient.db("test");
    d = new Date(req.body.date);
    if (!isNaN(d.getTime())) {
        db.collection('TEST', function (err, testCollection) {
            if (!err) {
                testCollection.insert({'date': d}, function (err) {
                });
            }
        });
        res.send("whatever");
    }
    else {
        console.log("received wrong date format");
        res.send("date format error");
    }
});

app.use(function(req, res) {
    res.send(req.url);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
