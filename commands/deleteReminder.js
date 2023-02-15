const { SlashCommandBuilder } = require('discord.js');
const ReminderRepository = require('../repositories/reminder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('delete_reminder')
		.addStringOption(option => option.setName('name').setDescription('Skin name').setRequired(true))
		.setDescription('Delete a created reminder with the selected skin'),
	async execute(interaction) {
		await interaction.deferReply();
		ReminderRepository.deleteReminder(interaction);
	},
};