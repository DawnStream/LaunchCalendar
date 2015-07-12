/**
 * Created by ariky on 4/5/15.
 */

debug = require('debug')('http');

var ObjectID = require('mongodb').ObjectID;

LaunchController = function(db) {
    this.db = db;
};

LaunchController.prototype.getAll = function(callback) {
    var q = {};
    var result = [];

    this.db.collection('TestLaunches', function(err, launchCollection) {
        if (err) {
            callback(err);
            return;
        }
        launchCollection.find(
            q,
            function (err, launches) {
                if (err) {
                    callback(err);
                    return;
                }
                /* rockets.count(function (err, count) {
                 console.log("count = ", count);
                 })   */
                launches.each(function (err, x) {
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

LaunchController.prototype.create = function(launch, callback) {
    this.db.collection('TestLaunches', function(err, launchCollection) {
        launch.created = new Date();
        launchCollection.insert(launch, function(err, doc) {
            if (err) {
                callback(err, {});
            } else {
                callback(null, doc);
            }
        })
    })
};
module.exports = LaunchController;