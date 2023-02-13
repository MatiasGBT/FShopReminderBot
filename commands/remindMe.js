const { SlashCommandBuilder } = require('discord.js');
const ReminderRepository = require('../repositories/reminder');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remind_me')
		.addStringOption(option => option.setName('name').setDescription('Skin name').setRequired(true))
		.setDescription('Create a reminder with the selected skin'),
	async execute(interaction) {
		await interaction.deferReply();
		ReminderRepository.createReminder(interaction);
	},
};