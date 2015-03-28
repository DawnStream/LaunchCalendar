var http = require('http'),
    express = require('express'),
    path = require('path'),
    Mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    RocketsController = require('./controllers/rocketController').RocketController


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
    db.collection("Rockets", function(error, the_collection) {
        if( error ) {
            console.log("can't find collection Rockets");
        }
        else  {
            console.log("found collection");
        }
    })
});

var app = express();
app.set('port', process.env.PORT || 3000);

app.use(function(req, res, next) {
    console.log('%s @ %s: %s %s', req.headers.host, req.headers['x-real-ip'],
        req.method, req.url);
    next();
})

app.get('/', function (req, res) {
  res.send("ARIK RULES!!");
});

app.get('/cal/:manufacturer', function(req, res) {
    rocketController.getAllRockets(req.params.manufacturer, function (err, rockets) {
        if (err) {
            res.send(400, err);
        }
        else {
            console.log(rockets);
            res.write("<HTML><HEAD></HEAD><BODY><H1>Rockets:<br>");
            rockets.forEach(function (rocket) {
                res.write(rocket.oid.toString() + ": " + rocket.Manufacturer.toString() + " " + rocket.Model.toString() + rocket.Version.toString() + "<br>");
            })
            res.end("</BODY>");
        }
    })
});

app.use(function(req, res) {
    res.send(req.url);
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
