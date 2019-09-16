/* This controls dynamic generation of member section of team 
 * Author: HartCode Programmer
 * Date: 09/16/2019
 */

/* function is to get Register team member section 
 * @param MemberId (Number) - contains selected TeamId to delete team
 * @param team (javastring object) - contains team with member details to be displayed 
 * calls:  
 * called by:
 */
function getRegTeamMemb(team) {
    $("#contentDiv").empty();
    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "membSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Fill-in below to Register a Member"))
            .append($("<form/>")
                .attr("id", "newMembForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
        //display the team name to user as reference during addition of member
    let inputDiv = getInputDiv("teamname", "Team Name", "", "text");
    $("#newMembForm").append(inputDiv);
    $("#teamname").val(team.TeamName);
    $("#teamname").attr("readonly", true);
    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("membername", "Member Name", "Enter Member Name", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("email", "Member Email", "Enter Member Email", "email");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("phone", "Member Phone No", "Enter Member Phone No", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("contactname", "Contact Name", "Enter Contact Name", "text");
    $("#newMembForm").append(inputDiv);
    inputDiv = getInputDiv("age", "Age", "Enter Member Age", "number");
    $("#newMembForm").append(inputDiv);
    // Gender selection radio box
    $("#newMembForm").append($("<div>")
            .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
            .append($("<div/>")
                .attr("class", "offset-md-6"))
            .append($("<div/>")
                .attr("id", "maleDiv")
                .append($("<input/>")
                    .attr("class", "form-check-input ml-4")
                    .attr("name", "gender")
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
                    .attr("name", "gender")
                    .attr("id", "female")
                    .val("Female")
                    .attr("type", "radio"))
                .append($("<label/>")
                    .attr("class", "form-check-label")
                    .attr("for", "female")
                    .html("Female"))))
        //Set member genderr radio based on team gender selection
    if (team.TeamGender == "Male") {
        $("#male").attr("checked", true);
        $("#female").attr("checked", false);
    } else if (team.TeamGender == "Female") {
        $("#male").attr("checked", false);
        $("#female").attr("checked", true);
    } else {
        $("#male").attr("checked", false);
        $("#female").attr("checked", false);
    }

    // Submit the form to server & update the member
    $("#newMembForm").append($("<div/>")
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
                    submitRegMembForm(team);
                })))
        // button to reset the member registration form
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
                    resetRegMembForm();
                })
            ))
        // button to go back to team details page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Cancel")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    getTeamDetail(team.TeamId);
                }))))
}

function submitRegMembForm(team) {
    // Above did not follow camelCase, as keeping it in sync with server naming standard
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateMembForm(team);
    if (isDataValid) {
        // AJAX call to send the form data to server upon serialization 
        $.post(`http://localhost:3000/members/${team.TeamId}`, $("#newMembForm").serialize(),
                function(data) {
                    // upon successful addition of team, take back to added league and show the added team along with others in the league
                    errorMsg = "Member has been successfully added";
                    $("#errorMsgId").html(errorMsg);
                    $("#errorMsgId").removeClass("badInput");
                    getTeamDetail(team.TeamId);
                })
            .fail(function() {
                errorMsg = "Failure to add member, please retry"
                $("#errorMsgId").html(errorMsg);
                $("#errorMsgId").addClass("badInput");
            });
        return false;
    }
}

/* function is to build javascript object and call common validate Member function
 *  and read the error status and build error message appropriately
 * @param: None
 * Calls: validateMemb()
 */
function validateMembForm(team) {
    let temp = "";
    let inputData = {
        membername: "",
        email: "",
        contactname: "",
        age: "",
        gender: "",
        phone: ""
    };
    inputData.membername = $("#membername").val();
    inputData.email = $("#email").val();
    inputData.contactname = $("#contactname").val();
    inputData.age = $("#age").val();
    inputData.phone = $("#phone").val();
    inputData.gender = $("input[name=gender]:checked").val();
    // Send input form data and create javascript object
    let resp = validateMemb(inputData, team);

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

/* function is to reset register member without resetting the team name
 * @param: None
 * calls: None
 * called by: getRegTeamMemb()
 */

function resetRegMembForm() {
    $("#membername").val("");
    $("#email").val("");
    $("#contactname").val("");
    $("#age").val("");
    $("#phone").val("");
    //Reset Gender Status
    $("input[name=gender]:checked").val("Male");
    $("input[name=teamgender]:checked").prop("checked", false);
    $("#male").prop("checked", true);
}

/* function is to populate team member profile template and set event  
 * handlers for various action such as edit, delete, cancel, reset and Goback
 * @param MemberId (Number) - User selected team member's ID 
 * @param team (Number) - User selected member's team details  
 * calls: getEditMemb(), delMemb(), getTeamMembDetails(), loadMemb(), getTeamDetail() 
 * Called By: getTeamMembDetails()
 */
function getTeamMembDetails(MemberId, team) {

    $("#contentDiv").empty();
    $("#contentDiv")
        .append($("<section/>")
            .attr("id", "membSection")
            .append($("<h2/>")
                .attr("class", "font-italic")
                .html("Member Profile"))
            .append($("<form/>")
                .attr("id", "editMembForm")
                .attr("action", "#")
                .attr("target", "_self")
                .attr("method", "GET")
            )
        )
        //display the team name to user as reference during addition of member
    let inputDiv = getInputDiv("teamname", "Team Name", "", "text");
    $("#editMembForm").append(inputDiv);
    $("#teamname").val(team.TeamName);
    $("#teamname").attr("readonly", true);
    //Generate all inputDiv dynamically for registering a team
    inputDiv = getInputDiv("memberid", "Member Id", "", "Number");
    $("#editMembForm").append(inputDiv);
    $("#memberid").attr("readonly", true);
    inputDiv = getInputDiv("membername", "Member Name", "Enter Member Name", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("email", "Member Email", "Enter Member Email", "email");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("phone", "Member Phone No", "Enter Member Phone No", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("contactname", "Contact Name", "Enter Contact Name", "text");
    $("#editMembForm").append(inputDiv);
    inputDiv = getInputDiv("age", "Age", "Enter Member Age", "number");
    $("#editMembForm").append(inputDiv);
    // Gender selection radio box
    $("#editMembForm").append($("<div>")
            .attr("class", "row form-check form-check-inline col-md-8 ml-2 mt-1")
            .append($("<div/>")
                .attr("class", "offset-md-6"))
            .append($("<div/>")
                .attr("id", "maleDiv")
                .append($("<input/>")
                    .attr("class", "form-check-input ml-4")
                    .attr("name", "gender")
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
                    .attr("name", "gender")
                    .attr("id", "female")
                    .val("Female")
                    .attr("type", "radio"))
                .append($("<label/>")
                    .attr("class", "form-check-label")
                    .attr("for", "female")
                    .html("Female"))))
        // Button for action on members 
    $("#editMembForm").append($("<div/>")
        .attr("class", "row offset-md-4 col-md-8")
        .attr("id", "dispMembDiv")
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .attr("type", "button")
                .html("Edit")
                .on("click", function(e) {
                    e.preventDefault();
                    //Clear prior informational message
                    $("#errorMsgId").empty();
                    getEditMemb(MemberId, team);
                })))
        // button to reset the member registration form
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                .attr("data-toggle", "modal")
                .attr("data-target", "#unRegisterMemberDiv")
                .attr("type", "button")
                .html("Delete")
                .on("click", function(e) {
                    e.preventDefault();
                    //Clear prior informational message
                    $("#errorMsgId").empty();
                    delMemb(MemberId, team);
                })
            ))
        // button to go back to team details page on cancel 
        .append($("<div/>")
            .attr("class", "mt-3 col-md-2")
            .append($("<button/>")
                .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                .html("Go back")
                .on("click", function(e) {
                    e.preventDefault();
                    // clear any informational message
                    $("#errorMsgId").empty();
                    getTeamDetail(team.TeamId);
                }))))

    $("#editMembForm").append($("<div/>")
            .attr("class", "row offset-md-4 col-md-8")
            .attr("id", "editMembDiv")
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .attr("type", "button")
                    .html("Save")
                    .on("click", function(e) {
                        //Clear prior informational message
                        $("#errorMsgId").empty();
                        e.preventDefault();
                        subEditMembForm(MemberId, team);
                    })))
            // button to reset the member registration form
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-danger")
                    .attr("type", "button")
                    .html("Reset")
                    .on("click", function(e) {
                        //Clear prior informational message
                        $("#errorMsgId").empty();
                        e.preventDefault();
                        loadMemb(member);
                    })
                ))
            // button to go back to team details page on cancel 
            .append($("<div/>")
                .attr("class", "mt-3 col-md-2")
                .append($("<button/>")
                    .attr("class", "btn btn-sm btn-block btn-primary btn-info")
                    .html("Cancel")
                    .on("click", function(e) {
                        e.preventDefault();
                        // clear any informational message
                        $("#errorMsgId").empty();
                        getTeamMembDetails(MemberId, team);
                    }))))
        //Get member details from server to populate values for above team member template
    getMember(MemberId, team.TeamId);
}

/* function is to get member details from server based on teamid and memberid from team details section
 * @param MemberId (Number) - User selected team member's ID 
 * @param TeamId (Number) - Team ID of user selected member 
 * calls: None
 * Called By: getTeamMembDetails()
 */
function getMember(MemberId, TeamId) {
    // Pull team details under a teamId
    $.getJSON(`http://localhost:3000/members/${TeamId}/${MemberId}`, function(data) {
            member = data;
        })
        .done(function() {
            // upon successful AJAX call perform the below
            //Populate DOM with values and set attribute accordingly
            loadMemb(member);
            setDispMembAttr();
        })
        .fail(function() {
            // upon failure response, send message to user
            errorMsg = "Failure to get data for Member details, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        });
}

/* function is to populate the member details for edit/display and reset action from member profile section  
 * @param member (javastring object) - Contains the member selected by User
 * calls: None
 * Called By: getTeamMembDetails()
 */
function loadMemb(member) {
    $("#memberid").val(member.MemberId);
    $("#memberid").parent().hide();
    $("#membername").val(member.MemberName);
    $("#email").val(member.Email);
    $("#contactname").val(member.ContactName);
    $("#age").val(member.Age);
    $("#phone").val(member.Phone);
    $("input[name=gender]:checked").val(member.Gender);

    if (member.Gender == "Male") {
        $("#male").attr("checked", true);
        $("#female").attr("checked", false);
    } else {
        $("#male").attr("checked", false);
        $("#female").attr("checked", true);
    }
}

/* function is to set attributes for display team member section  
 * @param None 
 * calls: None
 * Called By: getMember()
 */
function setDispMembAttr() {
    //Protect the member details during display
    $("#membername").attr("readonly", true);
    $("#email").attr("readonly", true);
    $("#contactname").attr("readonly", true);
    $("#age").attr("readonly", true);
    $("#phone").attr("readonly", true);

    //Show and Hide the gender as per selected team gender value (Not allowed to edit)
    if ($("input[name=gender]:checked").val() == "Male") {
        $("#femaleDiv").hide();
        $("#maleDiv").show();
    } else {
        $("#femaleDiv").show();
        $("#maleDiv").hide();
    }
    $("#dispMembDiv").show();
    $("#editMembDiv").hide();

}

/* function is to show edit team member fields and set attributes for them 
 * @param None 
 * calls: None
 * Called By: getTeamMembDetails()
 */
function getEditMemb(MemberId, team) {
    setEditMembAttr();
    $("#editMembDiv").show();
    $("#dispMembDiv").hide();
}

/* function is to set attributes for Edit member section  
 * @param None 
 * calls: None
 * Called By: getEditMemb()
 */
function setEditMembAttr() {
    $("#membername").attr("readonly", false);
    $("#email").attr("readonly", false);
    $("#contactname").attr("readonly", false);
    $("#age").attr("readonly", false);
    $("#phone").attr("readonly", false);
}

/* function is to submit changed member details and bring back to member details section
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: getTeamMembDetails()
 * Called By: getTeamMembDetails()
 */
function subEditMembForm(MemberId, team) {
    let errorMsg;
    // validate user input before posting to server
    let isDataValid = validateMembForm(team);
    if (isDataValid) {
        $.ajax({
            url: `http://localhost:3000/members/${team.TeamId}`,
            type: "PUT",
            data: $("#editMembForm").serialize()
        }).done(function() {
            // clear any informational message
            $("#errorMsgId").empty();
            errorMsg = "Member has been updated";
            $("#errorMsgId").removeClass("badInput");
            getTeamMembDetails(MemberId, team);
        }).fail(function() {
            errorMsg = "Failure to submit changed member data, please retry"
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").addClass("badInput");
        })
    }
}

/* function is to delete team member 
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: subDelMemb()
 * Called By: getTeamMembDetails()
 */
function delMemb(MemberId, team) {

    //Initialize modal before populating new one
    $("#unRegisterMemberDiv").remove();
    let modalDiv = getModalTemplate("unRegisterMemberDivLabel", "unRegisterMemberDiv", "unRegMemberModalBody", "unRegMemberModalFooter");
    $("#contentDiv").append(modalDiv);

    //Modal event handler assignments
    //Modal event to show during focus
    $('#unRegisterMemberDiv').on('shown.bs.modal', function() {
        $("#unRegisterMemberDiv").modal(focus);
    });

    //Modal event handler during modal closure to show the league page with selected option
    $('#unRegisterMemberDiv').on('hidden.bs.modal', function(e) {
        //"Success" status indicates that team has been deleted and good to shift the focus
        if ($("#errorMsgId").html() == "Success") {
            getTeamDetail(team.TeamId);
            errorMsg = "Member has been successfully deleted";
            $("#errorMsgId").html(errorMsg);
            $("#errorMsgId").removeClass("badInput");
            setTimeout("$('#contentDiv').focus();", 200);
        }
    });

    //Set title for modal
    $("#unRegisterMemberDivLabel").text("Team Member UnRegistration");
    //Set modal body content for generated modal template
    $("#unRegMemberModalBody").append($("<p/>")
            .html("Delete the Member"))
        //button to perform operation
    $("#unRegMemberModalFooter")
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
                subDelMemb(MemberId, team);
            }))
}

/* function is to delete team member by sending data to server and set information message
 * @param MemberId (number) - memberID of edited member details  
 * @param team (javastring object) - populate the team details of member in the member details page
 * calls: getTeamDetail()
 * Called By: delMemb()
 */
function subDelMemb(MemberId, team) {
    $.ajax({
        url: `http://localhost:3000/members/${team.TeamId}/${MemberId}`,
        type: "DELETE",
        // contentType: 'application/json'
    }).done(function() {
        //Clear prior informational message and set Success status to shift focus
        $("#errorMsgId").empty();
        $("#errorMsgId").html("Success");
    }).fail(function() {
        errorMsg = "Failure to delete team member due to issue, please retry"
        $("#errorMsgId").html(errorMsg);
        $("#errorMsgId").addClass("badInput");
    })
};