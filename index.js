const { token } = require('./config.json');
const { Client, Collection, GatewayIntentBits, Events } = require("discord.js");
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

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

client.on("ready", () =>{
    console.log("The bot is online");
});

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

client.login(token);