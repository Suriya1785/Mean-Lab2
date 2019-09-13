/* This is app server controller for cricket leagues app
 * Date: 09/13/2019
 * Made changes to include routes for users and index
 */
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//middleware modules inclusion  
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// express app creation
var app = express();

// handlebars template engine
const hbs = require('hbs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//register hbs partials
hbs.registerPartials(__dirname + '/views/partials');

// partials function for year tag in the footer section
hbs.registerHelper('getCurrentYear', function() {
    return new Date().getFullYear();
})

// logger, bodyparser, cookie parser and static page routing location setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//middleware routing  
app.use('/index', indexRouter);
app.use('/users', usersRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

//Below exposes app module to use in other javascript modules
module.exports = app;