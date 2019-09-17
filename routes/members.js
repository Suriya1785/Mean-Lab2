/*
 * This is express router to support members section at server 
 * Date: 09/16/2019
 *
 */
let express = require("express");
const membersRouter = express.Router();
let fs = require("fs");

//utils custom module reference
const teams = require('./../routes/teams');
const counters = require('./../utils/counters');

/* Function is to get a specific member from the team
 * Calls: teams.getTeams(), teams.getMatchingTeamById() 
 */
membersRouter.get("/:teamid/:memberid", function(request, response) {
    let teamId = request.params.teamid;
    let memberId = request.params.memberid;
    let teamsData = teams.getTeams();

    // find the team member on the team
    let team = teams.getMatchingTeamById(teamId, teamsData)
    if (team == null) {
        response.statusCode = 404;
        response.end("Team Not Found");
        return;
    }

    // find existing member on the team
    let match = team.Members.find(m => m.MemberId == memberId);
    if (match == null) {
        response.statusCode = 404;
        response.end("Member Not Found");
        return;
    }
    response.end(JSON.stringify(match));
});

/* Function is to add a member to the team
 * Calls: teams.getTeams(), teams.getMatchingTeamById(), counters.getNextId(), isValidMember() 
 */
membersRouter.post("/:id", function(request, response) {
    let teamId = request.params.id;

    // assemble member information so we can validate it
    let member = {
        MemberId: counters.getNextId("member"), // assign new id
        Email: request.body.email,
        MemberName: request.body.membername,
        ContactName: request.body.contactname,
        Age: Number(request.body.age),
        Gender: request.body.gender,
        Phone: request.body.phone
    };

    //"Performing member validation..."
    if (!isValidMember(member)) {
        response.statusCode = 400;
        response.end("Bad Request - Incorrect or Missing Data");
        return;
    }

    let teamsData = teams.getTeams();

    let match = teams.getMatchingTeamById(teamId, teamsData)
    if (match == null) {
        response.statusCode = 404;
        response.end("Team Not Found");
        return;
    }

    // make sure assignment doesn't violate team rules
    if (member.Age < match.MinMemberAge || member.Age > match.MaxMemberAge) {
        response.statusCode = 409;
        response.end("Member's age is outside of bounds of team age rules");
        return;
    }

    if (match.TeamGender != "Any" && member.Gender != match.TeamGender) {
        response.statusCode = 409;
        response.end("Member's gender does not conform to team gender rules");
        return;
    }

    // add the team
    match.Members[match.Members.length] = member;
    teams.saveTeams(teamsData);
    response.statusCode = 200;
    response.end();
});

/* Function is to edit a member in the team
 * Calls: teams.getTeams(), teams.getMatchingTeamById(), counters.getNextId(), isValidMember() 
 */

membersRouter.put("/:id", function(request, response) {
    let teamId = request.params.id;
    // assemble member information so we can validate it
    let member = {
        MemberId: request.body.memberid,
        Email: request.body.email,
        MemberName: request.body.membername,
        ContactName: request.body.contactname,
        Age: Number(request.body.age),
        Gender: request.body.gender,
        Phone: request.body.phone
    };

    if (!isValidMember(member)) {
        response.statusCode = 400;
        response.end("Bad Request - Incorrect or Missing Data");
        return;
    }

    // find the team
    let teamsData = teams.getTeams();
    let team = teams.getMatchingTeamById(teamId, teamsData)
    if (team == null) {
        response.statusCode = 404;
        response.end("Team Not Found");
        return;
    }

    // find existing member on the team
    let match = team.Members.find(m => m.MemberId == request.body.memberid);
    if (match == null) {
        response.statusCode = 404;
        response.end("Member Not Found");
        return;
    }

    // update the member
    match.Email = request.body.email;
    match.MemberName = request.body.membername;
    match.ContactName = request.body.contactname;
    match.Age = Number(request.body.age);
    match.Gender = request.body.gender;
    match.Phone = request.body.phone;

    // make sure edit doesn't violate team rules

    if (match.Age < team.MinMemberAge || match.Age > team.MaxMemberAge) {
        response.statusCode = 409;
        response.end("Member's age is outside of bounds of team age rules");
        return;
    }

    if (team.TeamGender != "Any" && match.Gender != team.TeamGender) {
        response.statusCode = 409;
        response.end("Member's gender does not conform to team gender rules");
        return;
    }
    teams.saveTeams(teamsData);
    response.statusCode = 200;
    response.end();
});


/* Function is to delete a member in the team
 * Calls: teams.getTeams(), teams.getMatchingTeamById(), counters.getNextId(), teams.saveTeams()  
 * Called by: membersRouter.delete()
 */
membersRouter.delete("/:teamid/:memberid", function(request, response) {
    let teamId = request.params.teamid;
    let memberId = request.params.memberid;

    // find the team
    let teamsData = teams.getTeams();

    let team = teams.getMatchingTeamById(teamId, teamsData)
    if (team == null) {
        response.statusCode = 404;
        response.end("Team Not Found");
        return;
    }

    // find existing member on the team
    let foundAt = team.Members.findIndex(m => m.MemberId == memberId);

    let match = null;
    // delete the member if found
    if (foundAt != -1) {
        match = team.Members.splice(foundAt, 1);
    }

    teams.saveTeams(teamsData);
    response.statusCode = 200;
    response.end();
})



/* Function is to validate the member data received from the client at Server end
 * Called by: membersRouter.post()
 * Calls: None
 */

function isValidMember(member) {
    if (member.Email == undefined || member.Email.trim() == "")
        return false;
    if (member.MemberName == undefined || member.MemberName.trim() == "")
        return false;
    if (member.ContactName == undefined || member.ContactName.trim() == "")
        return false;
    if (member.Phone == undefined || member.Phone.trim() == "")
        return false;
    if (member.Age == undefined || isNaN(member.Age))
        return false;
    if (member.Gender == undefined || member.Gender.trim() == "")
        return false;
    if (member.Gender != "Any" && member.Gender != "Male" && member.Gender != "Female")
        return false;

    return true;
}


module.exports = membersRouter;