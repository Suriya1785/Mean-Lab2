// This has all utilities to support the app
// Date: 09/13/2019
/*
 *This function is to validate the user entered e-mail and password with stored user credentials 
 * at server level
 * @param: email (string) - user entered email in login page
 * @param: password(string) - user entered password in login page
 * @param: users (javastring object) - All users from users.json  
 * Called by: usersRouter (users.js)
 * Calls: None
 */
authorize = function(email, password, users) {
    var validUser = users.filter((user) => {
        return user.email === email && user.password === password;
    });

    if (validUser.length === 1) {
        return true;
    }
    return false;
}

//Below exposes this function to other js modules
module.exports = {
    authorize
};