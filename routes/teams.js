/*
 * This is express router to support teams section at server 
 * Date: 09/13/2019
 *
 */
const express = require('express');
const teamsRouter = express.Router();
const fs = require('fs');

//multer third party module for image upload
const multer = require('multer');
//utils custom module reference
const counters = require('./../utils/counters');

let storage = multer.diskStorage({
    destination: function(request, teamimage, cb) {
        cb(null, 'public/images/teams')
    },
    filename: function(request, teamimage, cb) {
        cb(null, `${counters.getNextId("team", true)}_${teamimage.originalname}`)
    }
});

let upload = multer({ storage: storage });


/* Get all teams by league code and sends it to client */
teamsRouter.get('/byleague/:id', function(request, response) {
    let id = request.params.id;
    let teams = getTeams();
    let matches = getMatchingTeamsByLeague(id, teams);
    response.end(JSON.stringify(matches));
});

/* Function is to get team details by team id 
 * Called by teamsRouter.get()
 * Calls: None
 */
teamsRouter.get('/:id', function(request, response) {
    let id = request.params.id;
    let teams = getTeams();
    let matches = getMatchingTeamById(id, teams);
    response.end(JSON.stringify(matches));
});

/* Function is to register a team with image
 * Called by client
 * Calls: getNextId(), saveTeams(), getTeams()
 */

teamsRouter.post("/", upload.single('teamimage'), function(request, response) {

    try {
        if (request.file.filename) {
            // Save image in /public/images/teams folder
            var image = `/images/teams/${counters.getNextId("team", true)}_${request.file.originalname}`;

            //Initialize the team points
            let teamPoints = 0;

            // assemble team information so we can validate it
            let team = {
                TeamId: counters.getNextId("team"), // assign id to team
                TeamName: request.body.teamname,
                League: request.body.leaguecode,
                ManagerName: request.body.managername,
                ManagerPhone: request.body.managerphone,
                ManagerEmail: request.body.manageremail,
                MaxTeamMembers: Number(request.body.maxteammembers),
                MinMemberAge: Number(request.body.minmemberage),
                MaxMemberAge: Number(request.body.maxmemberage),
                TeamGender: request.body.teamgender,
                TeamPoints: Number(teamPoints),
                //Added for teamlogo changes
                TeamLogo: image,
                Members: []
            };

            //Performing team validation...
            if (!isValidTeam(team)) {
                response.statusCode = 400;
                response.end("Bad Request - Incorrect or Missing Data");
                return;
            }
            let teams = getTeams();
            teams[teams.length] = team;
            saveTeams(teams);
            response.statusCode = 200;
            response.end();
        }
    } catch (e) {
        console.log(e);
    }
});

/* function is to edit a team except image
 * Called by client
 * Calls: getTeams(), getMatchingTeamById(), getMinAgeOfMember(), getMaxAgeOfMember()
 *  isThereAnyGenderChangeConflicts()
 */
teamsRouter.put("/", function(request, response) {

    // assemble team information so we can validate it
    let team = {
        TeamId: request.body.teamid,
        TeamName: request.body.teamname,
        League: request.body.leaguecode,
        ManagerName: request.body.managername,
        ManagerPhone: request.body.managerphone,
        ManagerEmail: request.body.manageremail,
        MaxTeamMembers: Number(request.body.maxteammembers),
        MinMemberAge: Number(request.body.minmemberage),
        MaxMemberAge: Number(request.body.maxmemberage),
        TeamGender: request.body.teamgender,
    };

    if (!isValidTeam(team)) {
        response.statusCode = 400;
        response.end("Bad Request - Incorrect or Missing Data");
        return;
    }
    let teams = getTeams();

    // find team
    let match = getMatchingTeamById(request.body.teamid, teams)
    if (match == null) {
        response.statusCode = 404;
        response.end("Team Not Found - Check the team Id");
        return;
    }

    // update the team
    match.TeamName = request.body.teamname;
    match.League = request.body.leaguecode;
    match.ManagerName = request.body.managername;
    match.ManagerPhone = request.body.managerphone;
    match.ManagerEmail = request.body.manageremail;

    // make sure new values for max members, min/max age, or gender
    // don't conflict with members already on team

    if (Number(request.body.maxteammembers) < match.Members.length) {
        response.statusCode = 409;
        response.end("Team size too small based on current roster");
        return;
    }
    match.MaxTeamMembers = Number(request.body.maxteammembers);

    if (Number(request.body.minmemberage) > getMinAgeOfMember(match)) {
        res.status(409).send("Minimum age is greater than current member on team");
        return;
    }
    match.MinMemberAge = Number(request.body.minmemberage);

    if (Number(request.body.maxmemberage) < getMaxAgeOfMember(match)) {
        response.statusCode = 409;
        response.end("Maximum age is less than current member on team");
        return;
    }
    match.MaxMemberAge = Number(request.body.maxmemberage);

    if (isThereAnyGenderChangeConflicts(request.body.teamgender, match)) {
        response.statusCode = 409;
        response.end("Gender change conflicts with current member on team");
        return;
    }
    match.TeamGender = request.body.teamgender
    saveTeams(teams);
    response.statusCode = 200;
    response.end();
});

/* function is to delete team based on the team id sent from client
 * Calls: getTeams(), saveTeams()
 * Called by: Client AJAX delete call
 */
teamsRouter.delete("/:id", function(request, response) {
    let id = request.params.id;

    let teams = getTeams();

    // find the index number of the team in the array
    let foundAt = teams.findIndex(t => t.TeamId == id);

    // delete the team if found
    if (foundAt != -1) {
        match = teams.splice(foundAt, 1);
    }
    saveTeams(teams);
    // Note:  even if we didn't find them, send a 200 because they are gone
    response.statusCode = 200;
    response.end();
});


/* Function is to get list of teams by league code
 * Called by teamsRouter()
 * Calls: None
 */
function getMatchingTeamsByLeague(leagueCode, data) {
    let matches = data.filter(t => t.League == leagueCode);
    return matches;
}

/* Function is to get all existing teams
 * Called by getMatchingTeamsByLeague()
 * Calls: None
 */
function getTeams() {
    let data = fs.readFileSync("./data/teams.json");
    data = JSON.parse(data);
    return data;
}

/* Function is to save team to teams.json upon successful validation
 * @param: teams (javastring object) - contains all teams data 
 * Called by:
 * Calls: None
 */
var saveTeams = function(teams) {
    fs.writeFileSync('data/teams.json', JSON.stringify(teams));
}

/* Function is to get team by TeamId
 * Called by getMatchingTeamsByLeague()
 * Calls: None
 */
function getMatchingTeamById(id, data) {
    let match = data.find(t => t.TeamId == id);
    return match;
}

function isValidTeam(team) {
    if (team.TeamName == undefined || team.TeamName.trim() == "")
        return false;
    if (team.League == undefined || team.League.trim() == "")
        return false;
    if (team.ManagerName == undefined || team.ManagerName.trim() == "")
        return false;
    if (team.ManagerPhone == undefined || team.ManagerPhone.trim() == "")
        return false;
    if (team.ManagerEmail == undefined || team.ManagerEmail.trim() == "")
        return false;
    if (team.MaxTeamMembers == undefined || isNaN(team.MaxTeamMembers))
        return false;
    if (team.MinMemberAge == undefined || isNaN(team.MinMemberAge))
        return false;
    if (team.MaxMemberAge == undefined || isNaN(team.MaxMemberAge))
        return false;
    if (team.TeamGender == undefined || team.TeamGender.trim() == "")
        return false;
    if (team.TeamGender != "Any" && team.TeamGender != "Male" && team.TeamGender != "Female")
        return false;

    return true;
}


// ------ Membership change conflict helpers ------------------
/* function is to get the minimum age of member in the team to validate against the requested
 * team allowed minimum age
 */
function getMinAgeOfMember(team) {
    let minAge = 100000;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) < minAge) {
            minAge = Number(team.Members[i].Age);
        }
    }
    return minAge;
}

/* function is to get the maximum age of member in the team to validate against the requested
 * team allowed maximum age
 */
function getMaxAgeOfMember(team) {
    let maxAge = -1;
    for (let i = 0; i < team.Members.length; i++) {
        if (Number(team.Members[i].Age) > maxAge) {
            maxAge = Number(team.Members[i].Age);
        }
    }
    return maxAge;
}

/* function is to check on the gender conflict with the client request gender
 */
function isThereAnyGenderChangeConflicts(newTeamGender, team) {
    if (newTeamGender == "Any") {
        // No conflict w/ team switching to coed
        return false;
    }

    let conflictGender = newTeamGender == "Male" ? "Female" : "Male";
    for (let i = 0; i < team.Members.length; i++) {
        // look for member whose gender would conflict with new team gender
        if (team.Members[i].Gender == conflictGender) {
            return true; // found a conflict!
        }
    }
    return false; // no conflicts
}

// Below exposes the teamsRouter to be used in other javascript modules
module.exports = teamsRouter;
module.exports.getMatchingTeamById = getMatchingTeamById;
module.exports.getTeams = getTeams;
module.exports.saveTeams = saveTeams;