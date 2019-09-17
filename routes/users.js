/* This function is to hold all server processes javascripts for user section
 * Date: 09/13/2019
 */
//Third party modules for node js
var express = require('express');
var usersRouter = express.Router();
const fs = require("fs");

//utils custom module reference
const authorization = require('./../utils/auth');

/* GET users login page. */
usersRouter.get('/login', function(req, res, next) {
    res.render('login', { title: 'login' });
});

/* GET users register page. */
usersRouter.get('/register', function(req, res, next) {
    res.render('register', { title: 'register' });
});

/* Get logout section - Delete user session during logout. */
usersRouter.get('/logout', function(request, response) {

    request.session.destroy(function(e) {
        if (e) {
            console.log(e);
            response.end(e);
        } else {
            // it does not work, handled it with client end
            response.redirect('/index');
        }
    })
});

/* Post and persist user registration info. */
usersRouter.post('/register', function(request, response, next) {
    // get user data from AJAX request body
    var email = request.body.email;
    var password = request.body.password;
    var username = request.body.username;
    //insert user to json file
    user = insertUser(username, email, password);
    if (user) {
        response.statusCode = 200;
        response.end();
    } else {
        response.statusCode = 403; // Forbidden
        response.end();
    }

});

/* Authentication of users login. */
usersRouter.post('/login', function(request, response) {
    // get user data from form
    users = getUsers();
    var email = request.body.email;
    var password = request.body.password;
    if (authorization.authorize(email, password, users)) {
        request.session.email = email;
        response.statusCode = 200;
        response.end();
    } else {
        response.statusCode = 403; // Forbidden
        request.session.email = null;
        response.end();
    }
});

/* Function is to save User to users.json upon successful validation
 * @param: users (javastring object) - contains all users data 
 * Called by:
 * Calls: None
 */
var saveUsers = function(users) {
    fs.writeFileSync('data/users.json', JSON.stringify(users));
}

/* Function is to add User to users.json upon successful validation
 * @param: users (javastring object) - contains all users data 
 * Called by: insertUser()
 * Calls: getUsers(), saveUsers()
 */
var insertUser = (username, email, password) => {
    var users = getUsers();

    // in ES6, if param and prop names are the same,
    // you can use the following syntax instead of
    // username: username, password: password, email: email
    var user = {
        username,
        password,
        email
    };

    // ensure no dups users
    var duplicateUsers = users.filter((user) => {
        return user.username === username;
    });

    // ensure no dups emails  
    var duplicateEmails = users.filter(function(user) {
        return user.email === email;
    })

    // perform update to users.json if user/email do not exist and return user details
    if (duplicateUsers.length == 0 && duplicateEmails.length == 0) {
        users.push(user);
        saveUsers(users);
        return user;
    }
};

/* Function is to get all existing Users from users.json for further operation and 
 * return empty array if no users exist
 * @param: None  
 * Called by: insertUser() and usersRouter.post()
 * Calls: None
 */
var getUsers = function() {
    try {
        var usersString = fs.readFileSync('data/users.json');
        return JSON.parse(usersString);
    } catch (err) {
        console.log(err);
        return [];
    }
}

module.exports = usersRouter;