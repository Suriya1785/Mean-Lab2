/* This has counter utilities to get the team id or member id  
 * Date: 09/13/2019
 */
//Third party modules for node js
var express = require('express');
const fs = require("fs");

function getNextId(counterType, readOnly) // use 'member' or 'team' as counterType
{
    // read the counter file
    let counters = getCounters();
    // find the next id from the counters file and then increment the
    // counter in the file to indicate that id was used
    let id = -1;
    switch (counterType.toLowerCase()) {
        case "team":
            id = counters.nextTeam;
            counters.nextTeam++;
            break;
        case "member":
            id = counters.nextMember;
            counters.nextMember++;
            break;
    }
    // save the updated counter
    if (!readOnly) {
        saveCounters(counters);
    }
    return id;
}

/* function is to get counter file data from counters.json
 */
var getCounters = function() {
    let data = fs.readFileSync("./data/counters.json");
    data = JSON.parse(data);
    return data;
}

/* function is to update the counter file with identiified new counter value in counters.json
 */
var saveCounters = function(counters) {
    fs.writeFileSync("./data/counters.json", JSON.stringify(counters));
}

module.exports = {
    getNextId
};