/* This controls dynamic generation of js for league sections
 * Author: HartCode Programmer
 * Date: 09/16/2019
 */
/* function is to get league Section for display  
 * @param: leagueCode (string) - league code indicating league option
 * Calls: loadleaguesForLeagueSection()
 * Called by: getRegTeam(), submitRegForm(), loadTeamDetails(), getDelTeam(), 
 * getDelTeam(), window onload, loadleagues()
 */
function getleagueSection(leagueCode) {
    let leagues;
    let leaguesLocalStorage = JSON.parse(sessionStorage.getItem("leaguesLocal"));

    if (leaguesLocalStorage == "") {
        errorMsg = "Failure to get leagues list from local storage, please refresh the page"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    } else {
        leagues = leaguesLocalStorage;
        if (leagueCode == undefined) {
            // Store the JSON data in javaScript objects (Pull leagues).  
            loadleaguesForLeagueSection(leagues, leagueCode);
        } else {
            // Selected particular league
            loadleaguesForLeagueSection(leagues, leagueCode);
        }
    }
}

/* function is to load leagues under league selection dropdown 
 * @param leagues (javastring object) - contains list of leagues 
 * @param leagueCode (string) - selected league code from home page
 * calls: getTeams(), getAddTeam()
 */
function loadleaguesForLeagueSection(leagues, leagueCode) {
    $("#contentDiv").empty();
    $("#contentDiv").removeClass("text-center");
    $("#footerDiv").addClass("fixed-bottom");
    $("#contentDiv").append($("<section>")
        .attr("id", "leagueSection")
        // User friendly message for league dropdown
        .append($("<h3/>")
            .html("Select the Leagues from the dropdown list:")
            .attr("class", "font-italic"))
        // League Dropdown Div and DDL
        .append($("<div>")
            // .attr("class", "row")
            .append($("<label/>")
                .attr("class", "d-none d-md-inline")
                .attr("for", "selectLeagueList")
                .html("League Lists"))
            .append($("<select/>")
                .attr("id", "selectLeagueList")
                .attr("class", "d-none d-inline form-control col-md-3 ml-2")
                .on("change", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                    $("#footerDiv").removeClass("fixed-bottom");
                    // clear the team table Div before populating data for respective option
                    $("#teamTableDiv").empty();
                    getTeams($("#selectLeagueList").val());
                    // Store in session storage for goback functionality from team details page
                    let leagueSelection = $("#selectLeagueList").val();
                    sessionStorage.setItem("leagueSelSession", leagueSelection);
                })
                //Add default option and view all option
                .append($("<option/>")
                    .val("")
                    .html("Select league from dropdown list"))
            ))
        // table to list the teams under selected league dropdown option
        .append($("<div/>")
            .append($("<div/>")
                .attr("id", "teamTableDiv")
                .attr("class", "col-auto ml-2")))
        // Add team button in league section
        .append($("<div/>")
            .attr("class", "col-md-2")
            .append($("<button/>")
                .attr("id", "regTeamBtn")
                .attr("class", "btn btn-info mt-2")
                .html("Register Team")
                .on("click", function(e) {
                    // prevent all default action and do as we direct
                    e.preventDefault();
                    // Clear the fixed bottom as register page will have data
                    $("#footerDiv").removeClass("fixed-bottom");
                    // Clear all prior error messages
                    $("#errorMsgId").empty();
                    // Usage of cache for retrieving JSON object (requires stringify and parse, as cache can have only string)
                    let leaguesLocalStorage = JSON.parse(sessionStorage.getItem("leaguesLocal"));
                    // Get Add team section template
                    getRegTeam(leaguesLocalStorage);
                })))
    );

    //Run through league and populate the dropdown
    $.each(leagues, function(key, value) {
        $("#selectLeagueList").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Add viewAll option at the end after populating all dropdown
    $("#selectLeagueList").append($("<option/>")
        .val("all")
        .html("View All"));

    // Set selection dropdown to the selected league from home section, if chosen
    if (leagueCode != undefined) {
        $("#selectLeagueList").val(leagueCode);
        // Remove the footer to display at bottom always, as default selection is chosen from home section 
        $("#footerDiv").removeClass("fixed-bottom");
        getTeams(leagueCode);
    } else {
        $("#selectLeagueList").val("");
    }
}

/* function is to decide and call the appropriate get Teams option  
 * @param: leagueCode (String) - selected league from the dropdown
 * Calls: getAllTeams() & getTeamsPerLeague()
 * called by: loadleaguesForLeagueSection()
 */
function getTeams(leagueCode) {
    switch (leagueCode) {
        case "":
            //set the footer at the end of the page, as there is no data other than dropdown
            $("#footerDiv").addClass("fixed-bottom");
            errorMsg = "Please choose valid dropdown option from the given list";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
            break;
        case "all":
            getAllTeams();
            break;
        default:
            getTeamsPerLeague(leagueCode);
            break;
    }
}

/* function is to pull the list of all teams from all leagues for view all option
 * @param None 
 * calls: loadTeams()
 * called by: getTeams()
 */
function getAllTeams() {
    // AJAX call to get all Teams from all leagues
    $.getJSON("/api/teams", function(data) {
            teams = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeams(teams);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get all teams for view all option, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to pull the list of teams for selected league from the dropdown 
 * @param leagueCode (string) - contains selected league 
 * calls: loadTeams()
 * called by: getTeams()
 */
function getTeamsPerLeague(leagueCode) {

    //AJAX call to get all teams under a league
    $.getJSON(`http://localhost:3000/teams/byleague/${leagueCode}`, function(data) {
            teams = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeams(teams);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get all teams under selected league, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to create list of team under  details under selected league  
 * @param teams (javastring object) - contains list of teams received from server through AJAX call  
 * calls: getTeamDetails()
 * called by: getAllTeams(), getTeamsPerLeague() and getTeams()
 */
function loadTeams(teams) {
    //Create the team table with table head and table body
    // table = $("#teamsList");
    createTable();
    createTableHead();
    // Run through the teams under the league to create the table rows under tablebody
    $.each(teams, function(key, value) {
        $("#teamListTbody").append($("<tr/>")
            .append($("<td/>")
                .html(value.TeamName))
            .append($("<td/>")
                .html(value.ManagerName))
            .append($("<td/>")
                .html(value.TeamPoints))
            // create button and wire-in an event to provide more details on the team
            .append($("<td/>")
                .append($("<a/>")
                    .attr("class", "btn")
                    .attr("href", "#")
                    .append($("<i/>")
                        .attr("class", "fa fa-info-circle text-info"))
                    .on("click", function(e) {
                        e.preventDefault();
                        // Store in session storage for goback functionality from team details page
                        let leagueSelection = $("#selectLeagueList").val();
                        sessionStorage.setItem("leagueSelSession", leagueSelection);
                        // clear any informational message
                        $("#errorMsgId").empty();
                        getTeamDetail(value.TeamId);
                    })))
        )
    })
}

/* function is to create a table for table ID - teamslist
 * @param None
 * calls: None
 */
function createTable() {
    $("#teamTableDiv").append($("<table>")
        .attr("class", "table container table-responsive table-striped mt-3 ml-5")
        .attr("id", "teamList")
        .append($("<thead/>")
            .attr("id", "teamListThead"))
        .append($("<tbody/>")
            .attr("id", "teamListTbody")))
}

/* function is to create a tablehead for teamslist table
 * @param none
 * calls: None
 */
function createTableHead() {
    $("#teamListThead")
        .append($("<tr/>")
            .attr("class", "bg-info font-weight-light text-white")
            .append($("<th/>")
                .html("Team Name"))
            .append($("<th/>")
                .html("Manager"))
            .append($("<th/>")
                .html("Points"))
            .append($("<th/>")
                .html("Action")))
}