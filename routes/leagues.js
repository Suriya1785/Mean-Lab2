/*
 * This is express router to support leagues section at server 
 * Date: 09/13/2019
 *
 */
const express = require('express');
const leaguesRouter = express.Router();
const fs = require('fs');

/* GET leagues page. will not be used by client as client is SPA */
leaguesRouter.get('/', function(req, res, next) {
    // title is hbs variable (exist in template), 
    //can use layout:"xxx.hbs" to use different template other than default layout template
    res.render('leagues', { title: 'leagues' });
});


/* Get leagues data and sends it to client */
leaguesRouter.get('/data', function(request, response) {
    // set Content-Type for JSON
    // response.setHeader('Content-Type', 'application/json');
    response.end(fs.readFileSync('./data/leagues.json'));
});

// Below exposes the leaguesRouter to be used in other javascript modules
module.exports = leaguesRouter;