/**
 * Created by ariky on 4/1/15.
 */
'use strict';
var fs = require('fs');
var path = require('path');

fs.readdirSync(__dirname).forEach(function(file) {
    require(path.join(__dirname, file));
});