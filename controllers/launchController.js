/**
 * Created by ariky on 4/5/15.
 */

debug = require('debug')('http');

var ObjectID = require('mongodb').ObjectID;

LaunchController = function(db) {
    this.db = db;
};

LaunchController.prototype.getModel = function(model, callback) {
    var q = {};
    var result = [];
    if (model != "all") {
        q.Model = model;
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
                        debug(x);
                        result.push(x);
                    }
                })

            })
    });
};

LaunchController.prototype.create = function(rocket, callback) {
    this.db.collection('TestLaunches', function(err, rocketCollection) {
        rocketCollection.insert(rocket, function(err, doc) {
            if (err) {
                callback(err, {});
            } else {
                callback(null, doc);
            }
        })
    })
};
module.exports = LaunchController;