const { SlashCommandBuilder } = require('discord.js');
const ReminderRepository = require('../repositories/reminder');
const axios = require('axios');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remind_me')
		.addStringOption(option => option.setName('name').setDescription('Skin name').setRequired(true))
		.setDescription('Create a reminder with the selected skin'),
	async execute(interaction) {
		await interaction.deferReply();
		axios.get('https://fortnite-api.com/v2/cosmetics/br/search?name=' + interaction.options.getString('name') ?? '')
			.then(() => {
				ReminderRepository.createReminder(interaction);
			})
			.catch((error) => {
				interaction.editReply('Error, the selected skin does not exist');
			});
	},
};