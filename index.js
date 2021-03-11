const LOL_RANKS = require("./constants.js");
const db = require("./database/db.js");
const sql_queries = require("./database/sql_commands.js");

require("dotenv").config();
const moment = require("moment");
const axios = require("axios");
const Discord = require("discord.js");

const prefix = process.env.PREFIX;
const discord_token = process.env.DISCORD_TOKEN;
const lol_token = process.env.LOL_TOKEN;

const client = new Discord.Client();
const con = db.start_db();

client.on("message", async (message) => {
  console.log("Heard a message");
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();
  if (args.length >= 1) {
    if (command === "track") {
      playersArray = [];
      statsArray = [];
      await Promise.all(
        args.map(async (summonerName) => {
          console.log("Tried to scout " + summonerName);
          const response = await axios.get(
            "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
              summonerName +
              "?api_key=" +
              lol_token
          );
          const id = response.data.id;
          playersArray.push(response.data.name);
          const detailResponse = await axios.get(
            "https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/" +
              id +
              "?api_key=" +
              lol_token
          );
          var soloqStats = {};
          for (var i = 0; i < detailResponse.data.length; i++) {
            var testValues = detailResponse.data[i];
            if (testValues.queueType === "RANKED_SOLO_5x5") {
              soloqStats = testValues;
            }
          }
          if (Object.keys(soloqStats).length !== 0) {
            console.log(soloqStats);
            const uLp = soloqStats.leaguePoints;
            const uWins = soloqStats.wins;
            const uLosses = soloqStats.losses;
            const uRank = soloqStats.tier + " " + soloqStats.rank;
            const uRank_from_challenger = LOL_RANKS.indexOf(uRank);
            const current_time = moment().valueOf();
            statsArray.push(
              id,
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
          }
        })
      );
      con.query(
        sql_queries.insertIntoPlayers,
        playersArray,
        function (err, result) {
          if (err) {
            message.reply("Database wasn't avaible at the moment");
            return;
          }
          console.log(result);
        }
      );
      con.query(sql_queries.insertIntoStats, statsArray, (err, result) => {
        if (err) {
          message.reply("Database wasn't avaible at the moment");
          return;
        }
      });
      message.reply("Started tracking " + playersArray.join());
    }
    if (command === "check") {
      responseArray = [];
      console.log("Checking");
      await Promise.all(
        args.map(async (summonerName) => {
          con.query(
            sql_queries.getPlayers,
            [summonerName],
            (error, ogresults, fields) => {
              console.log("Results " + JSON.stringify(ogresults));
              if (ogresults.length === 1) {
                con.query(
                  sql_queries.getPlayerStatsByPid,
                  ogresults[0].pid,
                  (error, results, fields) => {
                    console.log(JSON.stringify(results[0]));
                    const winprcnt =
                      Math.round(
                        (results[0].wins /
                          (results[0].wins + results[0].losses) +
                          Number.EPSILON) *
                          100
                      ) / 100;
                    const responseString =
                      " ```" +
                      ogresults[0].player_name +
                      " \n " +
                      results[0].ranked_tier +
                      " - " +
                      results[0].current_lp +
                      "LP \n " +
                      results[0].wins +
                      " W / " +
                      results[0].losses +
                      " L (" +
                      winprcnt +
                      ") \n" +
                      " Last updated " +
                      moment(parseInt(results[0].last_update)).format("L LT") +
                      " ```";
                    console.log(responseString);
                    message.channel.send(responseString);
                  }
                );
              }
            }
          );
        })
      );
    }
  }
  if (command === "help") {
    message.channel.send(
      "``` All commands \n !track [summonerName] \n !check [summonerName] \n !remove [summonerName] \n !summary ```"
    );
  }
});

client.login(discord_token);

client.once("ready", () => {
  console.log("Ready!");
});
client.once("reconnecting", () => {
  console.log("Reconnecting!");
});
client.once("disconnect", () => {
  console.log("Disconnect!");
});
