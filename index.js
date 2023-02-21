require('dotenv').config();

const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const Bot = require('./start/bot.js');
Bot.startBot(client);

const Api = require('./start/api.js');
Api.startApi();

const Tasks = require('./start/tasks.js');
Tasks.startTasks(client);