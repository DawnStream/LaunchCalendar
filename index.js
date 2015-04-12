var http = require('http'),
    debug = require('debug')('http'),
    express = require('express'),
    path = require('path'),
    Mongoose = require('mongoose'),
    MongoClient = require('mongodb').MongoClient,
    Server = require('mongodb').Server,
    bodyParser = require('body-parser'),
    LaunchController = require('./controllers/launchController'),
    RocketController = require('./controllers/rocketController'),
    icalendar = require('icalendar');


var mongoHost = 'localHost';
var mongoPort = 27017;

var mongoClient = new MongoClient(new Server(mongoHost, mongoPort));
var rocketController;
var launchController;

mongoClient.open(function(err, mongoClient) {
    if (!mongoClient) {
        console.error("Error! Exiting... Must start MongoDB first");
        process.exit(1);
    }
    var db = mongoClient.db("test");
    rocketController = new RocketController(db);
    launchController = new LaunchController(db);
});

var app = express();
var app1 = express();
app1.set('port', 8080);
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
        } else {
            console.log(rockets);
            res.json(rockets);
        }
    })
});

app.get('/rocket/model/:model', function(req, res) {
    rocketController.getModel(req.params.model, function (err, rockets) {
        if (err) {
            res.send(400, err);
        } else {
            console.log(rockets);
            res.json(rockets);
        }
    })
});

app.post('/rocket/', function (req, res) {
    rocketController.create(req.body, function(err, doc) {
        if (err) {
            res.err(404);
        } else {
            res.send(doc);
        }
    })
});

app.get('/launch/', function(req, res) {
    launchController.getAll(function (err, launches) {
        if (err) {
            res.send(400, err);
        } else {
            res.json(launches);
        }
    })
})

app.post('/launch/', function (req, res) {
    launchController.create(req.body, function(err, doc) {
        if (err) {
            res.err(404);
        } else {
            res.send(doc);
        }
    })
});

app.post('/testDate/', function(req, res) {
    var db = mongoClient.db("test");
    var d = new Date(req.body.date);
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

app1.use(function(req, res, next) {
    console.log('%s @ %s: %s %s', req.headers.host, req.headers['x-real-ip'],
        req.method, req.url);
    next();
});

app1.use(function(req, res) {
    var ical = new icalendar.iCalendar();
    launchController.getAll(function(err, launches) {
        if (err) {
            res.send(500);
        } else {
            for (i = 0, leng = launches.length; i < leng; ++i) {
                var event = new icalendar.VEvent();
                event.setDate(launches[i].Date, 60*60);
                event.setSummary(launches[i].Mission + '-' + launches[i].Rocket.Model + launches[i].Rocket.Version);
                ical.addComponent(event);
            }
            res.send(ical.toString());
        }
    });
})

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});

http.createServer(app1).listen(app1.get('port'), function(){
    console.log('Express server listening on port ' + app1.get('port'));
});

