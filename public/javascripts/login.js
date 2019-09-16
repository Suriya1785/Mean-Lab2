/* function is to process login by getting user credentials and validate it from server and load leagues upon successful
 * validation
 * @param: None
 * Calls: postLoginForm(), showHome(), getHomeSection()
 * Called by: 
 */
function getLogin() {
    $("#contentDiv").empty();
    $("#contentDiv")
        .attr("class", "container justified-content-center text-center")
        // Login Section
        .append($("<section/>")
            // .attr("class", "row")
            .attr("id", "loginSection")
            .append($("<div/>")
                .attr("id", "loginDiv")
                .append($("<form/>")
                    .attr("class", "form-login")
                    .attr("id", "form-login")
                    .append($("<h1/>")
                        .attr("class", "h3 mb-3 font-weight-normal")
                        .html("Please Log in")))))
        // Input div to add form fields
    let inputDiv = getInputDiv("inputEmail", "Email Address", "Enter Email address", "email");
    $("#form-login").append(inputDiv);
    inputDiv = getInputDiv("inputPassword", "Password", "Enter Password", "password");
    $("#form-login").append(inputDiv);

    // Add buttons for login section
    $("#form-login").append($("<button/>")
            .attr("class", "btn btn-info mr-1 mt-2")
            .attr("id", "submitBtn")
            .attr("type", "submit")
            .on("click", function(e) {
                e.preventDefault();
                postLoginForm();
            })
            .html("Log in"))
        .append($("<button/>")
            .attr("class", "btn btn-secondary mr-1 mt-2")
            .attr("id", "cancelBtn")
            .attr("type", "button")
            .on("click", function(e) {
                e.preventDefault();
                getHomeSection();
                showHome();
            })
            .html("Cancel"))
        .append($("<button/>")
            .attr("class", "btn btn-lg btn-danger hidden mt-1")
            .attr("id", "logoutBtn")
            .attr("type", "button")
            .html("Log out"))
    $("#logoutBtn").hide();
}


/* function is to post login form upon user input 
 * @param: None  
 * Calls: getleagueSection(), showLeagues()
 * Called by: showLogin() 
 */
function postLoginForm() {
    let data = {
        "email": $('#inputEmail').val(),
        "password": $('#inputPassword').val()
    };

    $.post("http://localhost:3000/users/login", data, function() {})
        .done(function(res) {
            console.log("success");
            getleagueSection();
            showLogout();
            // getleagueSection();
            // showLeagues();
            // $('#msg').removeClass('alert-danger');
            // $('#msg').addClass('alert-success');
            // $('#msg').html('Success!');

            // $('#inputEmail').val('');
            // $('#inputEmail').attr("disabled", true);
            // $('#inputPassword').val('');
            // $('#inputPassword').attr("disabled", true);

            // $('#lock').attr('src', 'img/unlock.png');

            // $('#submitBtn').hide();
            // $('#logoutBtn').show();
            // $('#logoutBtn').focus();
        })
        .fail(function(e) {
            console.log(e);
            if (e.status === 401) {
                $('#errorMsgId').html('Account locked!');
            } else if (e.status === 403) {
                $('#errorMsgId').html('Invalid Creds!');
            } else {
                $('#errorMsgId').html(`Error: ${e.status}`);
            }
            $('#errorMsgId').removeClass('alert-success');
            $('#errorMsgId').addClass('alert-danger');
            $('#inputEmail').focus();
        });
    $('#errorMsgId').show();
};