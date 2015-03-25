/**
 * Created by ariky on 3/20/15.
 */

var ObjectID = require('mongodb').ObjectID;

RocketController = function(db) {
    this.db = db;
};

RocketController.prototype.getAllRockets = function(manufacturer, callback) {
    var q = {};
    var result = [];
    if (manufacturer != "all") {
        q.Manufacturer = manufacturer;
    }
    this.db.collection('Rockets', function(err, rocketsCollection) {
        if (err) {
            callback(err);
            return;
        }
        rocketsCollection.find(
            q,
            function (err, rockets) {
                if (err) {
                    callback(err);
                    return;
                }
                /* rockets.count(function (err, count) {
                    console.log("count = ", count);
                })   */
                rockets.each(function (err, x) {
                    if (x == null) {
                        callback(err, result);
                    } else {
                        x.oid = x._id;
                        delete x._id;
                        console.log(x);
                        result.push(x);
                    }
                })

            })
    });
};