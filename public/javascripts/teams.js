/* This controls dynamic generation of js for team - register, update and delete operations
 * Author: HartCode Programmer
 * Date: 09/16/2019
 */

/* function is to register a team from Leagues section  
 * @param: leagues (javaString object) - populate the league dropdown
 * Calls: SubmitRegForm(), getleagueSection(), getInputDiv()
 * called by: loadleaguesForLeagueSection()
 */
function getRegTeam(leaguesLocalStorage) {
    $("#contentDiv").empty();

    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "regTeamSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Fill-in below to Register a Team"))
            .append($("<form/>")
                .attr("id", "newTeamForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
    let inputDiv = getInputDiv("teamname", "Team Name", "Enter Team Name", "text");
    $("#newTeamForm").append(inputDiv);
    $("#newTeamForm").append($("<div/>")
        .attr("class", "row offset-md-3 col-md-8 mt-1 form-inline")
        .append($("<label/>")
            .attr("class", "d-none d-md-inline col-md-3")
            .attr("for", "leaguecode")
            .html("League"))
        .append($("<select/>")
            .attr("id", "leaguecode")
            .attr("name", "leaguecode")
            .attr("class", "d-inline form-control col-md-6")
            .on("change", function(e) {
                // prevent all default action and do as we direct
                e.preventDefault();
                // Clear all prior error messages
                $("#errorMsgId").empty();
                let leagueCode = $("#leaguecode").val();
                setGender(leagueCode, leaguesLocalStorage);
            })
            //Add default option and view all option
            .append($("<option/>")
                .val("")
                .html("Select league from dropdown list"))
        ));
    //Run through league objects from local storage and populate the dropdown for registering team
    $.each(leaguesLocalStorage, function(key, value) {
        $("#leaguecode").append($("<option/>")
            .val(value.Code)
            .html(value.Name))
    });

    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("managername", "Manager Name", "Enter Manager Name", "text");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("manageremail", "Manager Email", "Enter Manager Email", "email");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("managerphone", "Manager Phone No", "Enter Manager Phone No", "text");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxteammembers", "Maximum No of Team Members", "Enter Maximum No Of Team Members", "number");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("minmemberage", "Minimum Member Age", "Enter Minimum Member Age", "number");
    $("#newTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxmemberage", "Maximum Member Age", "Enter Maximum Member Age", "number");
    $("#newTeamForm").append(inputDiv);

    //Image file input definition
    $("#newTeamForm").append($("<div/>")
        .attr("class", "input-group row offset-md-3 col-md-6 mt-1 form-inline")
        .append($("<input/>")
            .attr("type", "file")
            .attr("name", "teamimage")
            .attr("id", "teamimage"))
        .append($("<label/>")
            .attr("for", "teamimage")))

    // Gender selection radio box
    $("#newTeamForm").append($("<div>")
        .attr("class", "row form-check form-check-inline col-md-6 ml-2 mt-1")
        .append($("<div/>")
            .attr("class", "offset-md-6"))
        .append($("<div/>")
            .attr("id", "maleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "male")
                .val("Male")
                .attr("type", "radio")
                .attr("checked", true))
            .append($("<label/>")
                .attr("class", " form-check-label")
                .attr("for", "male")
                .html("Male")))
        .append($("<div/>")
            .attr("id", "femaleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "female")
                .val("Female")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "female")
                .html("Female")))
        .append($("<div/>")
            .attr("id", "anyDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "any")
                .val("Any")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "any")
                .html("Any"))))

    // Submit the form to server & add team with image 
    $("#newTeamForm").on("submit", function(e) {
        e.preventDefault();
        $("#errorMsgId").empty();
        submitRegForm($("#leaguecode").val(), this);
    })

    // Button to perform actions on new register team form
    $("#newTeamForm").append($("<div/>")
        .attr("class", "row offset-md-4 col-md-8")
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .attr("type", "submit")
                .html("Submit")
            ))
        // button to reset the registration form
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                .attr("type", "reset")
                .html("Reset")
            ))
        // button to go back to league page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Cancel")
                .on("click", function(e) {
                    e.preventDefault();
                    $("#errorMsgId").empty();
                    let leagueSelection = sessionStorage.getItem("leagueSelSession");
                    getleagueSection(leagueSelection);
                }))))
}



/* function is to hide and show the gender option based on the league selection 
 * @param: leagueCode (string) - selected league from registering a team section
 * @param: leaguesLocalStorage(javastring object) - leagues object to match and find the supported gender
 * Calls: None()
 * Called by:
 */
function setGender(leagueCode, leaguesLocalStorage) {
    let leagueGender;

    //Get gender based on matching league & Usage of for to loop through an array of objects
    for (let i = 0; i < leaguesLocalStorage.length; i++) {
        if (leagueCode == leaguesLocalStorage[i].Code) {
            leagueGender = leaguesLocalStorage[i].Gender;
        }
    }

    //Hide or show the respective gender div and set checked parm through usage of switch
    switch (leagueGender) {
        case "Male":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#male").prop("checked", true);
            $("#maleDiv").show();
            $("#femaleDiv").hide();
            $("#anyDiv").hide();
            break;
        case "Female":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#female").prop("checked", true);
            $("#femaleDiv").show();
            $("#maleDiv").hide();
            $("#anyDiv").hide();
            break;
        case "Any":
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#any").prop("checked", true);
            $("#anyDiv").show();
            $("#maleDiv").hide();
            $("#femaleDiv").hide();
            break;
            // dropdown is not selected or back to choose dropdown option
        default:
            $("input[name=teamgender]:checked").prop("checked", false);
            $("#male").prop("checked", true);
            $("#anyDiv").show();
            $("#maleDiv").show();
            $("#femaleDiv").show();
            break;
    }
}

/* function is to send the user entered registration form for new Team to server
 * @param: None
 * Calls: getleagueSection()
 */
function submitRegForm(leagueCode, theForm) {
    // following did not follow camelCase, as name attribute expected 
    let errorMsg;
    var formData = new FormData(theForm);
    // validate user input before posting to server
    let isDataValid = validateForm();

    // Post team with image upload
    if (isDataValid) {
        $.ajax({
                type: 'POST',
                url: `http://localhost:3000/teams/`,
                data: formData,
                processData: false,
                contentType: false
            })
            .done(function() {
                // upon successful addition of team, take back to added league and show the added team along with others in the league
                errorMsg = "Team has been successfully added";
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").removeClass("badInput");
                // If team is added from select dropdown list option, then route back to viewall option to view added team
                if (leagueCode == "") {
                    leagueCode = "all";
                }
                getleagueSection(leagueCode);
            })
            .fail(function(e) {
                errorMsg = "Failure to register a team, please retry"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
                //Added to find out error messages during image upload and add team issues
                console.log(e);
            });
        return false;
    }
}

/* function is to build javascript object and call common validate function
 *  and read the error status and build error message appropriately
 * @param: None
 * Calls: validate()
 * called by: submitRegForm() submitEditForm()
 */
function validateForm(team) {
    let temp = "";
    let inputData = {
        teamname: "",
        leaguecode: "",
        managername: "",
        managerphone: "",
        manageremail: "",
        maxteammembers: "",
        minmemberage: "",
        maxmemberage: "",
        teamgender: "",
        teamlogo: ""
    };
    inputData.teamname = $("#teamname").val();
    inputData.leaguecode = $("#leaguecode").val();
    inputData.managername = $("#managername").val();
    inputData.managerphone = $("#managerphone").val();
    inputData.manageremail = $("#manageremail").val();
    inputData.maxteammembers = $("#maxteammembers").val();
    inputData.minmemberage = $("#minmemberage").val();
    inputData.maxmemberage = $("#maxmemberage").val();
    inputData.teamgender = $("input[name=teamgender]:checked").val();
    //team is not defined during registration of team and defined during editing a team
    // values are populated accordingly for image upload
    if (team == undefined) {
        if ($("#teamimage").val() != "") {
            inputData.teamlogo = $("#teamimage")[0].files[0].name;
        } else {
            inputData.teamlogo = "";
        }
    } else {
        // Executed during editing team details, populated from team and it is not editable during editing team
        inputData.teamlogo = team.TeamLogo;
    }

    // Send input form data and create javascript object
    let resp = validate(inputData, team);

    if (resp.status == true) {
        // Run through error message array and build message and update the ta
        $.each(resp.errorMsg, function(key, value) {
            temp = temp + "</br>" + value;
        })
        $("#errorMsgId").html(temp);
        $("#errorMsgId").addClass("badInput");
        return false;
    } else {
        return true;
    }
}

/* function is to get Team details from server for selected team 
 * @param: TeamId (number) - selected TeamId from leagues section
 * Calls: loadTeamDetails()
 */
function getTeamDetail(TeamId) {

    // Pull team details under a teamId
    $.getJSON(`http://localhost:3000/teams/${TeamId}`, function(data) {
            team = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            loadTeamDetails(team);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for team details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });

}

/* function is to generate DOM for received Team details from server 
 * @param: team (javastring object) - team details for selected TeamId
 * Calls: getEditTeam(), getDelTeam()
 * Called by:getTeamDetail
 */
function loadTeamDetails(team) {
    $("#contentDiv").empty();

    $("#contentDiv").attr("class", "container justified-content-center")
        // Team Details Section
        .append($("<section/>")
            .attr("id", "teamSection")
            .append($("<h2/>")
                .attr("class", "text-center font-italic")
                .html(team.TeamName))
            .append($("<div/>")
                .attr("class", "row")
                //bootstrap 4 card to display Team Manager information
                .append($("<div/>")
                    .attr("id", "managerCard")
                    .attr("class", "col-md-4")
                    .append(($("<div/>")
                        .attr("class", "card box-shadow cardStyle border-info")
                        .append($("<div/>")
                            .attr("class", "card-header text-center")
                            .append($("<h3/>")
                                .html("Team Manager")))
                        .append($("<div/>")
                            .attr("class", "card-body text-center")
                            .append($("<ul/>")
                                .attr("class", "list-unstyled mt-3 mb-4")
                                .append($("<li/>")
                                    .html(team.ManagerName))
                                .append($("<li/>")
                                    .html(team.ManagerEmail))
                                .append($("<li/>")
                                    .html(team.ManagerPhone))))))
                )
                //Team logo
                .append($("<div/>")
                    .attr("class", "col-md-3 text-center")
                    .append($("<img/>")
                        .attr("class", "img-responsive, imageWidth")
                        .addClass("hideimage")
                        .attr("src", team.TeamLogo)
                        .attr("alt", team.TeamId))
                )
                //bootstrap 4 card to display Team details
                .append($("<div/>")
                    .attr("id", "teamCard")
                    .attr("class", "col-md-5")
                    .append(($("<div/>")
                        .attr("class", "card mb-4 box-shadow cardStyle border-info")
                        .append($("<div/>")
                            .attr("class", "card-header text-center")
                            .append($("<h3/>")
                                .html("Team Details")))
                        .append($("<div/>")
                            .attr("class", "card-body text-center")
                            .append($("<ul/>")
                                .attr("class", "list-unstyled")
                                .append($("<li/>")
                                    .html(`League : ${team.League}`))
                                .append($("<li/>")
                                    .html(`Max Team Members : ${team.MaxTeamMembers}`))
                                .append($("<li/>")
                                    .html(`Minimum Age :${team.MinMemberAge}`))
                                .append($("<li/>")
                                    .html(`Maximum Age :${team.MaxMemberAge}`))
                                .append($("<li/>")
                                    .html(`Team Gender :${team.TeamGender}`))
                                .append($("<li/>")
                                    .html(`Team Points :${team.TeamPoints}`))
                            ))))
                )
            )
            // Button to edit team details
            .append($("<div/>")
                .attr("class", "row justify-content-center")
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Edit Team")
                        .on("click", function(e) {
                            e.preventDefault();
                            getEditTeam(team.TeamId);
                        })))
                // button to delete a team
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                        .attr("data-toggle", "modal")
                        .attr("data-target", "#unRegisterDiv")
                        .html("Delete Team")
                        .on("click", function(e) {
                            // e.preventDefault();
                            //Get up to date team details from server which would help to mark the record for edit in the future 
                            //to avoid any update from other user
                            getDelTeam(team.TeamId);
                        })
                    ))
                // button to go back to league section 
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Go Back")
                        .on("click", function(e) {
                            e.preventDefault();
                            //Clear the Informational message
                            $("#errorMsgId").empty();
                            let leagueSelection = sessionStorage.getItem("leagueSelSession");
                            getleagueSection(leagueSelection);
                        })))
                // button to register Team Member 
                .append($("<div/>")
                    .attr("class", "mt-3 col-md-2")
                    .append($("<button/>")
                        .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                        .html("Register Member")
                        .on("click", function(e) {
                            e.preventDefault();
                            //Clear the Informational message
                            $("#errorMsgId").empty();
                            getRegTeamMemb(team);
                        })))
            )

        )
        // Team member div to support responsive design
        .append($("<div/>")
            .append($("<h3/>")
                .html("Members")
                .attr("class", "mt-3 font-italic text-center"))
            .append($("<div/>")
                .attr("id", "teamMemberSection")
                .attr("class", "d-flex justify-content-center")
                .append($("<div/>")
                    .attr("id", "teamMemberDiv"))
            )
        );

    // Load Team member section
    loadTeamMember(team);
}


/* function is to generate DOM for team member for selected team 
 * @param: team (javastring object) - team details for selected TeamId
 * Calls: None
 */
function loadTeamMember(team) {

    //Create the table to show the list of members if members are enrolled  
    if (team.Members.length > 0) {
        createTeamMemberTable();
        createTableMemberHead();
        // Run through the teams under the league to create the table rows under tablebody
        $.each(team.Members, function(key, value) {
            $("#teamMembListTbody").append($("<tr/>")
                .append($("<td/>")
                    .html(value.MemberName))
                .append($("<td/>")
                    .html(value.Email))
                .append($("<td/>")
                    .html(value.Phone))
                // create button and wire-in an event to provide more details on the team
                .append($("<td/>")
                    .append($("<a/>")
                        .attr("class", "btn-sm")
                        .attr("href", "#")
                        .append($("<i/>")
                            .attr("class", "fa fa-info-circle text-info"))
                        .on("click", function(e) {
                            e.preventDefault();
                            //clear prior informtional message
                            $("#errorMsgId").empty();
                            getTeamMembDetails(value.MemberId, team);
                        }))))
        })
    } else {
        //Print informational message for team with no members enrolled yet
        $("#teamMemberDiv").append($("<p/>")
            .html("No members enrolled yet!!")
            .attr("class", "text-success"));
    }
}

/* function is to create a table for Team Member
 * @param None
 * calls: None
 */
function createTeamMemberTable() {
    $("#teamMemberDiv").append($("<table>")
        .attr("class", "table container table-responsive table-striped mt-3 ml-3 mr-3")
        .attr("id", "teamList")
        .append($("<thead/>")
            .attr("id", "teamMembListThead"))
        .append($("<tbody/>")
            .attr("id", "teamMembListTbody")))
}

/* function is to create a tableHead for Team Member
 * @param None
 * calls: None
 */
function createTableMemberHead() {
    $("#teamMembListThead")
        .append($("<tr/>")
            .attr("class", "bg-info font-weight-light text-white")
            .append($("<th/>")
                .html("Member Name"))
            .append($("<th/>")
                .html("Email"))
            .append($("<th/>")
                .html("Phone"))
            .append($("<th/>")
                //override if design is supported to have all edit , delete and info on team details page
                // .attr("colspan", "3")
                .attr("class", "text-center")
                .html("Actions"))
        )
}


/* function is to get Team details from server for selected team 
 * @param: TeamId (number) - TeamId pulled from edit details section
 * Calls: loadEditTeamDetails()
 * Called by: loadTeamDetails()
 */
function getEditTeam(TeamId) {
    // Pull team details under a teamId
    $.getJSON(`http://localhost:3000/teams/${TeamId}`, function(data) {
            team = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            //Populate DOM with values and set attribute accordingly
            loadEditTeamDetails(team);
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for team details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to create edit section template and load it with values  
 * @param team - team details of the selected edit by user  
 * calls: None
 * Called By: getEditTeam()
 */
function loadEditTeamDetails(team) {
    //Get league details from session storage to use it to populate dropdown
    //Usage of cache for retrieving JSON object (requires stringify and parse, as cache can have only string)
    let leaguesLocalStorage = JSON.parse(sessionStorage.getItem("leaguesLocal"));

    //clear the content div before creating team template
    $("#contentDiv").empty();

    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "editTeamSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Please find the below team details to make allowed changes"))
            .append($("<form/>")
                .attr("id", "editTeamForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
    let inputDiv = getInputDiv("teamid", "Team Id", "", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("teamname", "Team Name", "Enter Team Name", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("leaguecode", "League", "", "text");
    $("#editTeamForm").append(inputDiv);
    //Generate all inputDiv dynamically for editing a team
    inputDiv = getInputDiv("managername", "Manager Name", "Enter Manager Name", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("manageremail", "Manager Email", "Enter Manager Email", "email");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("managerphone", "Manager Phone No", "Enter Manager Phone No", "text");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxteammembers", "Maximum No of Team Members", "Enter Maximum No Of Team Members", "number");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("minmemberage", "Minimum Member Age", "Enter Minimum Member Age", "number");
    $("#editTeamForm").append(inputDiv);
    inputDiv = getInputDiv("maxmemberage", "Maximum Member Age", "Enter Maximum Member Age", "number");
    $("#editTeamForm").append(inputDiv);
    // Gender selection radio box
    $("#editTeamForm").append($("<div>")
        .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
        .append($("<div/>")
            .attr("class", "offset-md-6"))
        .append($("<div/>")
            .attr("id", "maleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "male")
                .val("Male")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", " form-check-label")
                .attr("for", "male")
                .html("Male")))
        .append($("<div/>")
            .attr("id", "femaleDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "female")
                .val("Female")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "female")
                .html("Female")))
        .append($("<div/>")
            .attr("id", "anyDiv")
            .append($("<input/>")
                .attr("class", "form-check-input ml-4")
                .attr("name", "teamgender")
                .attr("id", "any")
                .val("Any")
                .attr("type", "radio"))
            .append($("<label/>")
                .attr("class", "form-check-label")
                .attr("for", "any")
                .html("Any"))))

    // Submit the form to server & update the teams data
    $("#editTeamForm").append($("<div/>")
            .attr("class", "row offset-md-4 col-md-8")
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .attr("type", "button")
                    .html("Submit")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        submitEditForm(team.TeamId, team);
                    })))
            // button to reset the registration form
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                    .attr("type", "reset")
                    .html("Reset")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        // Populate the details from team received from server during edit details generation
                        loadEditTeamDetails(team, leaguesLocalStorage);
                    })
                ))
            // button to go back to team details section on cancel 
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .html("Cancel")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        // Go back and display the team details section
                        getTeamDetail(team.TeamId);
                    }))))
        //load team item values
    loadTeamItem(team, leaguesLocalStorage);
}

/* function is to load team details into created team template for presenting edit section  
 * @param team (javascript object) - team details of the selected edit by user 
 * @param leaguesLocalStorage (javascript object) - locally stored all leagues
 * calls: None
 * Called By: loadEditTeamDetails()
 */
function loadTeamItem(team, leaguesLocalStorage) {
    $("#teamid").val(team.TeamId);
    $("#teamid").parent().hide();
    $("#teamname").val(team.TeamName);
    $("#leaguecode").val(team.League);
    $("#managername").val(team.ManagerName);
    $("#managerphone").val(team.ManagerPhone);
    $("#manageremail").val(team.ManagerEmail);
    $("#maxteammembers").val(team.MaxTeamMembers);
    $("#minmemberage").val(team.MinMemberAge);
    $("#maxmemberage").val(team.MaxMemberAge);
    $("input[name=teamgender]:checked").val(team.TeamGender);

    //Set attribute
    $("#teamid").attr("readonly", true);
    //Fix this
    $("#leaguecode").attr("readonly", true);
    let leagueCode = $("#leaguecode").val();
    setGender(leagueCode, leaguesLocalStorage);
}

/* function is to load team details into created team template for presenting edit section  
 * @param TeamId (number) - teamId of edited team details (used to take back to edit page)  
 * calls: getTeamDetail()
 * Called By: loadEditTeamDetails()
 */
function submitEditForm(TeamId, team) {
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateForm(team);
    if (isDataValid) {
        $.ajax({
            url: 'http://localhost:3000/teams/',
            type: "PUT",
            data: $("#editTeamForm").serialize()
                // contentType: 'application/json'
        }).done(function() {
            getTeamDetail(team.TeamId);
        }).fail(function() {
            errorMsg = "Failure to get server data during team edit submission, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        })
    }
}

/* function is to get delete confirmation modal before performing deleting the team operation.  
 * @param TeamId (number) - teamId of team to be deleted
 * calls: getTeamDetail()
 * Called By: loadEditTeamDetails()
 */
function getDelTeam(TeamId) {

    //Clear modal upon each execution
    $("#unRegisterDiv").remove();
    let modalDiv = getModalTemplate("unRegisterDivLabel", "unRegisterDiv", "unRegModalBody", "unRegModalFooter");
    $("#contentDiv").append(modalDiv);

    //Modal event handler assignment
    //Modal event to show during focus
    $('#unRegisterDiv').on('shown.bs.modal', function() {
        $("#unRegisterDiv").modal(focus);
    });

    //Modal event handler during modal closure to show the league page with selected option
    $('#unRegisterDiv').on('hidden.bs.modal', function(e) {
        //"Success" status indicates that team has been deleted and good to shift the focus
        if ($("#errorMsgId").html() == "Success") {
            let leagueSelection = sessionStorage.getItem("leagueSelSession");
            getleagueSection(leagueSelection);
            //Clear the empty and set successful message
            $("#errorMsgId").empty();
            errorMsg = "Team has been successfully deleted";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").removeClass("badInput");
            setTimeout("$('#leagues').focus();", 200);
        }
    });

    //Set title for modal
    $("#unRegisterDivLabel").text("Team UnRegistration");
    //Set modal body content for generated modal template
    $("#unRegModalBody").append($("<p/>")
            .html("Please confirm to delete the team"))
        //button to perform operation
    $("#unRegModalFooter")
        //cancel button will take back to details page through modal setup
        .append($("<button/>")
            .attr("class", "btn btn-secondary")
            .attr("data-dismiss", "modal")
            .html("Cancel"))
        //confirm button to submit the delete team to server
        .append($("<button/>")
            .attr("class", "btn btn-primary btn-danger")
            .attr("data-dismiss", "modal")
            .html("Confirm")
            .on("click", function(e) {
                e.preventDefault();
                subDelTeam(TeamId);
            }))
}

/* function is to submit teamId to be deleted to server and go back to leagues section
 * @param TeamId (Number) - contains selected TeamId to delete team
 * calls: None
 * called by: getDelTeam()
 */
function subDelTeam(TeamId) {
    $.ajax({
        url: `http://localhost:3000/teams/${TeamId}`,
        type: "DELETE",
        // data: $("#editTeamForm").serialize()
        // contentType: 'application/json'
    }).done(function() {
        //Set informational delete status to change the focus to league page upon modal closure
        $("#errorMsgId").empty();
        $("#errorMsgId").html("Success");
    }).fail(function() {
        errorMsg = "Failure to delete Team request due to server issues, please retry"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    })
}