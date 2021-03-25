const db = require("./database/db.js");

require("dotenv").config();
const Discord = require("discord.js");

const prefix = process.env.PREFIX;
const discord_token = process.env.DISCORD_TOKEN;

const client = new Discord.Client();
const con = db.start_db();

const commands = require("./commands");

client.on("message", async (message) => {
  console.log("Heard a message");
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;
  const commandBody = message.content.slice(prefix.length);
  const args = commandBody.split(" ");
  const command = args.shift().toLowerCase();

  responseArray = [];
  if (args.length >= 1) {
    if (command === "track") {
      await Promise.all(
        args.map(async (summonerName) => {
          const trackedSummoners = await commands.START_TRACKING(con, message.author.id, summonerName);
          trackedSummoners !== null ? responseArray.push(trackedSummoners) : null;
        })
      );
      if (responseArray.length !== 0) responseArray.unshift("Started tracking ");
    }
    if (command === "check") {
      await Promise.all(
        args.map(async (summonerName) => {
          responseArray.push(await commands.CHECK_PLAYER(con, summonerName));
        })
      );
    }
    if (command === "remove") {
      await Promise.all(
        args.map(async (summonerName) => {
          responseArray.push(await commands.REMOVE_TRACKING(con, summonerName, message.author.id));
        })
      );
    }
  }
  if (command === "help") {
    responseArray.push(commands.HELP_INFO());
  }

  if (responseArray !== undefined && responseArray.length !== 0) {
    message.channel.send(responseArray.join(""));
  }
});
process.on('uncaughtException', function (err) {
  console.error(err);
  console.log("Node NOT Exiting...");
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
