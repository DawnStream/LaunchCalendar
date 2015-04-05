/**
 * Created by ariky on 4/3/15.
 */
rocketController = require('../controllers/RocketController');

module.exports =function(app) {
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
}
