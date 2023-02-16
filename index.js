const TOKEN = process.env.token;
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const express = require('express');
const app = express();

const fs = require('node:fs');
const path = require('node:path');
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
/*
First, path.join() helps to construct a path to the commands directory.
The fs.readdirSync() method then reads the path to the directory and returns
an array of all the file names it contains. To ensure only command files get
processed, Array.filter() removes any non-JavaScript files from the array.
With the correct files identified, the last step is to loop over the array and
dynamically set each command into the client.commands Collection. For each file
being loaded, check that it has at least the data and execute properties.
This helps to prevent errors resulting from loading empty, unfinished or otherwise
incorrect command files.
*/
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on("ready", () => {
	console.log("The bot is online");
});

//#region Express
//Necessary so that the build in Render does not fail.
//This is because Render performs a health check by
//verifying that the application returns a correct
//status code (between 200 and 399).
const PORT = process.env.PORT || 3030;
app.get('/', (req, res) => {
	res.sendStatus(200)
});

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}`)
});
//#endregion

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(TOKEN);

//#region Daily check task
var cron = require('node-cron');
const axios = require('axios');
const Connector = require('./connector');

cron.schedule('0 0 * * *', () => {
	console.log('Checking daily shop');
	getDailyShopItems();
});

async function getDailyShopItems() {
	axios.get('https://fortnite-api.com/v2/shop/br/combined').then((response) => {
		//Obtain (and concatenate) the items from the list of daily and featured items.
		let dailyShopItems = response.data.data.featured.entries.concat(response.data.data.daily.entries);
		//Bundles are removed to avoid errors
		dailyShopItems = dailyShopItems.filter(dailyShopItem => dailyShopItem.bundle == null);

		checkReminders(dailyShopItems);
	});
}

//For each of the items in the daily shop, check if any user has saved a reminder for an item.
function checkReminders(dailyShopItems) {
	let conn = Connector.startConnection();
	dailyShopItems.forEach(entry => {
		entry.items.forEach(item => {
			item.name = item.name.replaceAll('"', '');
			conn.query(`SELECT * FROM reminders WHERE skin_name = "${item.name}"`, function (error, results, fields) {
				if (error) throw error;
				if (results.length > 0) notifyUsers(results);
			});
		});
	});
	conn.end();
}

//Notifies (sends a private message) to users if a desired skin appeared in the daily shop.
function notifyUsers(results) {
	results.forEach(reminder => {
		client.users.send(reminder.user_id, reminder.skin_name + ' is in the daily shop! Date: ' + new Date().toLocaleDateString('en-US'));
	});
}

//This task sends the endpoint created above an alert every 20 minutes so that the bot does
//not "sleep" due to the Free Render Plan.
cron.schedule('*/20 * * * *', () => {
	axios.get('https://fshopreminder.onrender.com/').then((response) => {
		console.log("Refreshing")
	});
});
//#endregion