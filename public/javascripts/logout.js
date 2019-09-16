/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: None
 * Calls: get()
 * Called by: showLogin()
 */
function getLogout() {
    // get logout ajax call.  
    $.get("http://localhost:3000/users/logout", function() {})
        .done(function() {
            // upon successful AJAX call perform the below
            // Store leagues in Session storage to access for generating league section
            console.log("client - logout - success");
            $("registerAnchor").show();
            $("#loginAnchor").text("Login");
            window.location.href = '/index';
        })
        .fail(function(e) {
            // upon failure response, send message to user
            console.log(e);
            errorMsg = "Failure to logout, redirecting to home session";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}