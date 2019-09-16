/* This is to serve index.html with few ajax call to pull data from server (Express router exercise)
 * for home section of cricket leagues
 * Author: HartCode programmer
 */
"use strict";

$(function() {

    //Show Home as default by setting $ hide/show 
    getHomeSection();
    showHome();

    // $("#loginBtn").on("click", function() {
    //     showLogin();
    // })

    // Event handler for leagues from navbar
    $("#leaguesAnchor").on("click", function() {
        getleagueSection();
        showLeagues();
    })

    $("#loginAnchor").on("click", function() {
        let loginStatus = $("#loginAnchor").html();
        switch (loginStatus) {
            case "Login":
                showLogin();
                break;
            case "Logout":
                getLogout();
                // showHome();
                // getHomeSection();
            default:
                break;
        }
    })

    $("#registerAnchor").on("click", function() {
        showRegister();
    })

    // $("#registerBtn").on("click", function() {
    //     showRegister();
    // })

    // Event handler for Home from navbar
    $("#homeAnchor").on("click", function() {
        showHome();
        getHomeSection();
    })

    // Event handler for sitelogo from navbar
    $("#logoAnchor").on("click", function() {
        showHome();
        getHomeSection();
    })


});

/* function is to show the respective home sections view upon clicking on Home from the navigation bar 
 * @param: None
 * Calls: None
 * Called by: Window onload
 */
function showHome() {
    $("#home").attr("class", "active");
    $("#leagues").attr("class", "inactive");
    $("#login").attr("class", "inactive");
    $("#register").attr("class", "inactive");
    if ($("#loginAnchor").text() != "Logout") {
        $("#register").show();
    }
    $("#errorMsgId").empty();
}

/* function is to show the respective leagues information sections view upon clicking on Leagues from the navigation bar 
 * @param:  None
 * Calls: None
 * Called by Window onload
 */
function showLeagues() {
    //Set attribute of home section and leagues section
    $("#home").attr("class", "inactive");
    $("#login").attr("class", "inactive");
    $("#register").attr("class", "inactive");
    $("#leagues").attr("class", "active");
    $("#selectLeagueList").addClass("autofocus");
}

/* function is to show the respective Register view upon clicking on register from the navigation bar 
 * @param: None
 * Calls: None
 * Called by: Window onload
 */
function showRegister() {
    getRegister();
    $("#home").attr("class", "inactive");
    $("#leagues").attr("class", "inactive");
    $("#register").attr("class", "active");
    $("#login").attr("class", "inactive");
    $("#loginAnchor").html("Login");
    $("#errorMsgId").empty();
}

/* function is to show the respective login view upon clicking on Login from the navigation bar 
 * @param: None
 * Calls: None
 * Called by: Window onload
 */
function showLogin() {
    getLogin();
    $("#home").attr("class", "inactive");
    $("#leagues").attr("class", "inactive");
    $("#register").attr("class", "inactive");
    $("#login").attr("class", "active");
    $("#errorMsgId").empty();
}

/* function is to show the respective logout sections in navigation view upon successful login 
 * @param: None
 * Calls: None
 * Called by: Window onload
 */
function showLogout() {
    $("#home").attr("class", "inactive");
    $("#leagues").attr("class", "active");
    $("#register").attr("class", "inactive");
    $("#register").hide();
    // Set logout text for login
    $("#login").attr("class", "inactive");
    $("#loginAnchor").text("Logout");
    $("#errorMsgId").empty();
}

/* function is to get the home section DOM content by dynamically populating them 
 * @param: None
 * Calls: getLeagues(), getQuoteTag()
 * Called by: window onload
 */
function getHomeSection() {
    $("#contentDiv").empty();
    $("#contentDiv")
        .attr("class", "container justified-content-center")
        // Home Section
        .append($("<section/>")
            .attr("class", "row")
            .attr("id", "homeSection")
            //Reader Board Div
            .append($("<div/>")
                .attr("id", "readerBoard")
                .attr("class", "col-md-3")
                .append($("<h3/>")
                    .attr("class", "center")
                    .text("Welcome to world's second most followed sport!!"))
                .append($("<p/>")
                    .html("See the hot trend & Top Team from ongoing leagues")
                    .attr("class", "text-align-center fonthandler"))
                .append($("<table/>")
                    .attr("class", "table container table-responsive table-striped")
                    .attr("id", "rankingTable")
                    .append($("<thead/>")
                        .append($("<tr/>")
                            .attr("class", "bg-info font-weight-light text-white")
                            .append($("<th/>")
                                .html("League"))
                            .append($("<th/>")
                                .html("Top Team"))))
                    .append($("<tbody/>")
                        .attr("id", "rankingTbody"))
                )
            )
            //League List Div
            .append($("<div/>")
                .attr("class", "col-md-5")
                .attr("id", "leagueListDiv")
                .append($("<h3/>")
                    .attr("class", "font-weight-bold font-italic")
                    .html("List of Ongoing Leagues"))
                .append($("<ul/>")
                    .attr("id", "leagueListUl")
                    .attr("class", "list-unstyled list-inline"))
            )
            // Quotes and video Div
            .append($("<div/>")
                .attr("class", "col-md-4")
                // Video Div
                .append($("<div/>")
                    .attr("class", "row")
                    .append($("<h3/>")
                        .attr("class", "center font-italic")
                        .text("Cricket Quick Intro"))
                    // Embed iframe for cricket intro video and set allow full screen
                    .append($("<iframe/>")
                        .attr("class", "videoWidth")
                        .attr("src", "https://www.youtube.com/embed/Kwu1yIC-ssg")
                        .attr("allow", "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture")
                        .attr("allowfullscreen", "allowfullscreen")))
                //Quotes Div
                .append($("<div/>")
                    .attr("class", "row")
                    .attr("id", "quotesDiv")
                    .append($("<h3/>")
                        .html("Quotes by Great Cricketers")
                        .attr("class", "font-italic"))
                    .append($("<blockquote/>")
                        .attr("class", "font-italic")
                        .append($("<p/>")
                            .attr("id", "quoteTag")
                        )
                        .append($("<footer>")
                            .attr("class", "text-info")
                            .attr("id", "quoteAuthor"))
                    ))
            )
        );

    // Get the list of leagues from server and populate the list items dynamically
    getLeagues();

    // Get quote tags from server and populate blockquote
    getQuoteTag();
}

/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: None
 * Calls: loadLeagues()
 * Called by: showLogin()
 */
function getLeagues() {
    let leagues;
    // Store the JSON data in javaScript objects (Pull leagues from server).  
    $.getJSON("http://localhost:3000/leagues/data", function(data) {
            leagues = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            // Store leagues in Session storage to access for generating league section
            sessionStorage.setItem("leaguesLocal", JSON.stringify(leagues));
            loadLeagues(leagues);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get leagues list, please refresh the page"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}


/* function is to get quote tag from server and populate the value dynamically  
 * @param: None
 * Calls: None
 * Called by: getHomeSection
 */
function getQuoteTag() {
    let quotes;
    $.getJSON("http://localhost:3000/index/quotes", function(data) {
            quotes = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadQuotes(quotes);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get Quote Tags, please wait for few seconds"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to load quote tag from JSON every x seconds and populate the blockquote section dynamically  
 * @param: quotes - quote tag json received from server
 * Calls: None
 * Called by: getQuoteTag
 */
function loadQuotes(quotes) {
    let i = 0;
    let maxQuotes = quotes.length;
    //Usage of timer for displaying quote by serving it from server
    setInterval(function() {
        $("#quoteTag").attr("class", "blockquote");
        $("#quoteTag").html(quotes[i].quotes);
        $("#quoteAuthor").html(quotes[i].author);
        i++;
        //Reset it to beginning of quotes, if it reaches max
        if (i == maxQuotes) {
            i = 0;
        }
    }, 3000);
}

/* function is to get Team Rankings from teams data to display readerboard 
 * @param: leagues (Javascript objects) - List of leagues
 * Calls: loadRankingItem()
 * Called by: loadleagues()
 */
function getRankings(leagues) {
    let rankingArray = [];
    let teams;
    $.each(leagues, function(key, value) {
        console.log("league code" + value.Code);
        // Get all teams under league to find out the topmost team based on points
        $.getJSON(`http://localhost:3000/teams/byleague/${value.Code}`, function(data) {
                teams = data;
            })
            .done(function() {
                // upon successful AJAX call perform the below
                // Sort team based on points
                teams.sort(function(sortPoints1, sortPoints2) {
                    return (sortPoints2.TeamPoints - sortPoints1.TeamPoints);
                });
                rankingArray[rankingArray.length] = teams[0];
                // Dynamically populate the ranking table based on the item
                if (teams[0] != null) {
                    loadRankingItem(teams[0]);
                }
            })
            .fail(function() {
                // upon failure response, send message to user
                errorMsg = "Failure to get data for showing topmost team under league, please refresh the page"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
            });
    });
}

/* function is to get Team Rankings from teams data to display readerboard 
 * @param: team (Javascript object) - Topmost team under particular league
 * Calls: None
 * Called by: getRankings
 */
function loadRankingItem(team) {
    //Ranking table for top team in each league
    $("#rankingTbody").append($("<tr/>")
        .append($("<td/>")
            .html(team.League))
        .append($("<td/>")
            .html(team.TeamName)));
}


/* function is to get league data from server and call loadLeague to dynamically populate the DOM 
 * @param: leagues (JSON object) - list of leagues retrieved from server
 * Calls: None
 * Called by:
 */
function loadLeagues(leagues) {
    //Run through each leagues entry and populate 

    if (leagues.length != 0) {
        $.each(leagues, function(key, value) {
            $("#leagueListUl").append($("<li/>")
                .attr("class", "list-inline-item")
                .append($("<a/>")
                    .attr("href", "#")
                    .attr("class", "non-underline-link")
                    // Image tag to show the league logo
                    .append($("<img/>")
                        .attr("src", value.Img)
                        .attr("alt", value.Code)
                        .attr("class", "hideimage"))
                    .append($("<br/>"))
                    .append($("<span/>")
                        .attr("class", "text-secondary text-center")
                        .text(value.Name))
                    .on("click", function(e) {
                        // prevent all default action and do as we direct
                        e.preventDefault();
                        showLeagues();
                        getleagueSection(value.Code);
                        // Remove the fixed bottom class, as data is loaded and it needs to be responsive now
                        $("#footerDiv").removeClass("fixed-bottom");
                    })));
        });
        // Get and Show Top teams under Reader Board
        getRankings(leagues);
    } else {
        // Present informational message to user if no leagues currently ongoing
        $("#leagueListUl").append($("<li/>")
            .attr("class", "list-inline-item text-danger")
            // .addClass("red")
            .html("OOPS!!! No Ongoing Leagues & will be shortly in ACTION"))
        $("#rankingTable").empty();
        $("#readerBoard p").html("Cricket is a bat-and-ball game played between two teams of eleven players on a field at the centre of which is a 20-metre (22-yard) pitch with a wicket at each end, each comprising two bails balanced on three stumps. The batting side scores runs by striking the ball bowled at the wicket with the bat, while the bowling and fielding side tries to prevent this and dismiss each player (so they are 'out').");
    }
}