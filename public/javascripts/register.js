/* This controls dynamic generation of js for user - register
 * Update and delete operations to be done as part of future exercise
 * Author: HartCode Programmer
 * Date: 09/16/2019
 */

/* function is to process login by getting user credentials and validate it from server and load leagues upon successful
 * validation
 * @param: None
 * Calls: postRegisterForm(), showHome(), getHomeSection()
 * Called by: 
 */
function getRegister() {
    $("#contentDiv").empty();
    $("#contentDiv")
        .attr("class", "container justified-content-center text-center")
        // Register Section
        .append($("<section/>")
            // .attr("class", "row")
            .attr("id", "registerSection")
            .append($("<div/>")
                .attr("id", "registerDiv")
                .append($("<form/>")
                    .attr("class", "form-register")
                    .attr("id", "form-register")
                    .append($("<h1/>")
                        .attr("class", "h3 mb-3 font-weight-normal")
                        .html("Please Register")))))
        // Input div to add form fields
    let inputDiv = getInputDiv("inputUserName", "Name", "Enter User Name", "text");
    $("#form-register").append(inputDiv);
    inputDiv = getInputDiv("inputPassword", "Password", "Enter Password", "password");
    $("#form-register").append(inputDiv);
    inputDiv = getInputDiv("inputConfirmPassword", "Confirm Password", "Confirm Password", "password");
    $("#form-register").append(inputDiv);
    inputDiv = getInputDiv("inputEmail", "Email Address", "Enter Email address", "email");
    $("#form-register").append(inputDiv);

    // Add buttons for register section
    $("#form-register").append($("<button/>")
            .attr("class", "btn btn-info mr-1 mt-2")
            .attr("id", "submitBtn")
            .attr("type", "submit")
            .on("click", function(e) {
                e.preventDefault();
                postRegisterForm();
            })
            .html("Submit"))
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
            .attr("class", "btn btn-danger hidden mt-2")
            .attr("id", "resetBtn")
            .attr("type", "reset")
            .html("Reset"))
}


/* function is to post register form upon user input 
 * @param: None  
 * Calls: getleagueSection(), showLeagues()
 * Called by: showLogin() 
 */
function postRegisterForm() {
    let data = {
        "username": $("#inputUserName").val(),
        "email": $('#inputEmail').val(),
        "password": $('#inputPassword').val()
    };

    $.post("http://localhost:3000/users/register", data, function() {})
        .done(function(res) {
            console.log("success");
            showLogin();
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
                $('#errorMsgId').html('Invalid data!');
            } else {
                $('#errorMsgId').html(`Error: ${e.status}`);
            }
            $('#errorMsgId').removeClass('alert-success');
            $('#errorMsgId').addClass('alert-danger');
            $('#inputEmail').focus();
        });
    $('#errorMsgId').show();
};