const createPlayersTable = `create table if not exists players(
    pid varchar(255) primary key,
    player_name varchar(255)not null unique,
    discord_id varchar(255)not null)`;

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

const createDailyTable = `create table if not exists daily(
            timestamp int(11) NOT NULL PRIMARY KEY,
            biggest_lp_gain int,
            biggest_lp_gain_name varchar(255),
            biggest_lp_loss int,
            biggest_lp_loss_name varchar(255),
            most_wins_in_week int,
            most_wins_in_week_name varchar(255),
            most_losses_in_week int,
            most_losses_in_week_name varchar(255)
            )`;

const createWeekylTable = `create table if not exists weekly(
    timestamp varchar(255) NOT NULL PRIMARY KEY,
    biggest_lp_gain int,
    biggest_lp_gain_name varchar(255),
    biggest_lp_loss int,
    biggest_lp_loss_name varchar(255),
    most_wins_in_week int,
    most_wins_in_week_name varchar(255),
    most_losses_in_week int,
    most_losses_in_week_name varchar(255)
    )`;

const createAllTimeTable = `create table if not exists alltime(
    timestamp varchar(255) NOT NULL PRIMARY KEY,
    biggest_lp_gain int,
    biggest_lp_gain_name varchar(255),
    biggest_lp_loss int,
    biggest_lp_loss_name varchar(255),
    most_wins_in_week int,
    most_wins_in_week_name varchar(255),
    most_losses_in_week int,
    most_losses_in_week_name varchar(255)
    )`;

const insertIntoPlayers = `INSERT INTO players(pid,player_name,discord_id) VALUES(?,?,?)`;

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
const removePlayerByName = `DELETE FROM players WHERE player_name=?`;
const removeStatsById = `DELETE FROM stats WHERE pid=?`;

module.exports.createPlayersTable = createPlayersTable;
module.exports.createStatsTable = createStatsTable;
module.exports.insertIntoPlayers = insertIntoPlayers;
module.exports.insertIntoStats = insertIntoStats;
module.exports.getPlayers = getPlayers;
module.exports.getPlayerStatsByPid = getPlayerStatsByPid;
module.exports.removePlayerByName = removePlayerByName;
module.exports.removeStatsById = removeStatsById;
module.exports.createWeekylTable = createWeekylTable;
module.exports.createAllTimelTable = createAllTimeTable;
