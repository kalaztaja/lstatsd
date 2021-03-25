const lol_api = require("../api/lol-api.js");
const sql_commands = require("../database/sql_commands.js");
const sql_query = require("../database/sql_query.js");
const moment = require("moment");
const LOL_RANKS = require("../constants.js");

// Function takes DB connection, summoner name and message author discord id. Returns summoner name who started to get tracked

// The player record will be saved into player-table and created new stats-table corresponsing the player

async function START_TRACKING(dbCon, authorId, summonerName,) {
    playersArray = [];
    statsArray = [];
    try {
        const responseData = await lol_api.getSummonerByName(summonerName);
        if (responseData?.id !== undefined) {

            // First check if the summoner is already existing

            const alreadyExists = await sql_query(dbCon, sql_commands.getPlayers, [summonerName]);

            if (alreadyExists === undefined || alreadyExists.length !== 0) {
                return null;
            }
            else {
                const statsResponseData = await lol_api.getSoloqueStatsById(responseData.id);
                if (statsResponseData !== undefined && statsResponseData !== null) {
                    playersArray.push(responseData.id, responseData.name, authorId);
                    const uLp = statsResponseData.leaguePoints;
                    const uWins = statsResponseData.wins;
                    const uLosses = statsResponseData.losses;
                    const uRank = statsResponseData.tier + " " + statsResponseData.rank;
                    const uRank_from_challenger = LOL_RANKS.indexOf(uRank);
                    const current_time = moment().valueOf();
                    statsArray.push(
                        responseData.id,
                        0,
                        uLp,
                        uRank,
                        uRank_from_challenger,
                        uWins,
                        uLosses,
                        0,
                        0,
                        current_time
                    );
                    sql_query(dbCon, sql_commands.insertIntoPlayers, playersArray)
                    sql_query(dbCon, sql_commands.insertIntoStats, statsArray)
                    return responseData.name + " ";
                }
            }
        }
        return null;
    } catch (error) {
        console.log(error);
        return null;
    }

}

module.exports = START_TRACKING;
