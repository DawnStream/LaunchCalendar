/**
 * Created by ariky on 4/3/15.
 */
var express = require('express');
var rocketController = require('../controllers/RocketController');
var router = express.Router();
var controller = rocketController.getObject();

router.get('/manufacturer/:manufacturer', function(req, res) {
    controller.getManufacturer(req.params.manufacturer, function (err, rockets) {
        if (err) {
            res.send(400, err);
        }
        else {
            console.log(rockets);
            res.json(rockets);
        }
    })
});

router.get('/model/:model', function(req, res) {
    controller.getModel(req.params.model, function (err, rockets) {
        if (err) {
            res.send(400, err);
        }
        else {
            console.log(rockets);
            res.json(rockets);
        }
    })
});

module.exports = router;