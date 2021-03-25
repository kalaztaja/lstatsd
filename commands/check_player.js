const sql_commands = require("../database/sql_commands.js");
const moment = require("moment");
const sql_query = require("../database/sql_query.js");

async function CHECK_PLAYER(dbCon, summonerName) {
    try {
        const firstResults = await sql_query(dbCon, sql_commands.getPlayers, [summonerName]);
        if (firstResults[0]?.pid !== undefined) {
            const detailedResults = await sql_query(dbCon, sql_commands.getPlayerStatsByPid, [firstResults[0].pid]);
            if (detailedResults !== undefined && detailedResults.length !== 0) {
                const winprcnt = Math.round(
                    (detailedResults[0].wins /
                        (detailedResults[0].wins + detailedResults[0].losses) +
                        Number.EPSILON) *
                    100
                ) / 100;
                return " ```" +
                    firstResults[0].player_name +
                    " \n\n Stats: \n " +
                    detailedResults[0].ranked_tier +
                    " - " +
                    detailedResults[0].current_lp +
                    "LP \n " +
                    detailedResults[0].wins +
                    " W / " +
                    detailedResults[0].losses +
                    " L (" +
                    winprcnt +
                    ") \n" +
                    " Last updated " +
                    moment(parseInt(detailedResults[0].last_update)).format("L LT") +
                    " ```";
            }
        }
        return null;

    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = CHECK_PLAYER;