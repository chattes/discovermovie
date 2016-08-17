var express = require('express');
var router = express.Router();
var home = require('../controllers/home');
var tmdb = require('../controllers/tmdb');
module.exports = function (app) {

    router.get('/', home.index);
    router.get('/?p=:page_id', home.index);
    router.get('/start',tmdb.startDiscover);
    app.use(router);
};
