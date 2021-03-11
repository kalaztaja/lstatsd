const createPlayersTable = `create table if not exists players(
    pid varchar(255) primary key,
    player_name varchar(255)not null unique)`;

const createStatsTable = `create table if not exists stats(
        pid varchar(255) NOT NULL PRIMARY KEY, 
        previous_lp int, 
        current_lp int, 
        ranked_tier varchar(255), 
        ranked_tier_diff int, 
        wins int, 
        losses int, 
        wins_diff int, 
        losses_diff int, 
        last_update varchar(255)
        )`;

const insertIntoPlayers = `INSERT INTO players(pid,player_name) VALUES(?,?)`;

const insertIntoStats = `INSERT INTO stats(
    pid,
    previous_lp,
    current_lp,
    ranked_tier,
    ranked_tier_diff,
    wins,
    losses,
    wins_diff,
    losses_diff,
    last_update) VALUES(?,?,?,?,?,?,?,?,?,?)`;

const getPlayers = `SELECT * FROM players WHERE player_name=?`;
const getPlayerStatsByPid = `SELECT * FROM stats WHERE pid=?`;

module.exports.createPlayersTable = createPlayersTable;
module.exports.createStatsTable = createStatsTable;
module.exports.insertIntoPlayers = insertIntoPlayers;
module.exports.insertIntoStats = insertIntoStats;
module.exports.getPlayers = getPlayers;
module.exports.getPlayerStatsByPid = getPlayerStatsByPid;
