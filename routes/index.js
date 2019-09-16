var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'CricketLeagues' });
});


/* Get quotes tag and sends it to client */
router.get('/quotes', function(request, response) {
    // set Content-Type for JSON
    response.setHeader('Content-Type', 'application/json');
    response.end(fs.readFileSync('./data/quotes.json'));
});

module.exports = router;