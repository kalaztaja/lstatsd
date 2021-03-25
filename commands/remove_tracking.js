
const sql_query = require("../database/sql_query.js");
const sql_commands = require("../database/sql_commands.js");

async function REMOVE_PLAYER(dbCon, summonerName, authorId) {
    try {
        const checkPlayer = await sql_query(dbCon, sql_commands.getPlayers, [summonerName]);
        if (checkPlayer !== undefined && checkPlayer.length !== 0) {
            if (checkPlayer[0]?.discord_id === authorId) {
                const result = await sql_query(dbCon, sql_commands.removeStatsById, checkPlayer[0].pid);
                console.log(result);
                if (result !== undefined && result.length !== 0) {
                    const secondResult = await sql_query(dbCon, sql_commands.removePlayerByName, [summonerName]);
                    if (secondResult !== undefined && secondResult !== 0) {
                        return "Removal was succesful";
                    }
                }
                return "There was an error removing player. Contact admin";
            }
            else {
                return "You cannot remove tracking if someone else has done it";
            }
        }
        return "Player not found";
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = REMOVE_PLAYER;