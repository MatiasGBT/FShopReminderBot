const { SlashCommandBuilder } = require('discord.js');
const Connector = require('../connector');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(interaction) {
		let conn = Connector.startConnection();
		conn.end();
		await interaction.reply('Pong!');
	},
};