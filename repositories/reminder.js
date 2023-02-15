const Connector = require('../connector');

module.exports = class ReminderRepository {
    static createReminder(interaction) {
        const userId = interaction.user.id;
		const skinName = interaction.options.getString('name') ?? '';
        let conn = Connector.startConnection();
        conn.query(`SELECT * FROM reminders WHERE user_id = '${userId}' AND skin_name = '${skinName}'`, function (error, results, fields) {
            if (error) interaction.editReply('Server error');

            if (results.length > 0) {
                interaction.editReply('Error, there is already a reminder of this skin for this user');
            } else {
                conn.query(`INSERT INTO reminders (user_id, skin_name) VALUES ('${userId}', '${skinName}')`);
				interaction.editReply('Reminder created!');
            }

            conn.end();
        });
    }

    static deleteReminder(interaction) {
        const userId = interaction.user.id;
		const skinName = interaction.options.getString('name') ?? '';
        let conn = Connector.startConnection();
        conn.query(`SELECT * FROM reminders WHERE user_id = '${userId}' AND skin_name = '${skinName}'`, function (error, results, fields) {
            if (error) interaction.editReply('Server error');

            if (results.length == 0) {
                interaction.editReply('Error, there is no reminder for this skin');
            } else {
                conn.query(`DELETE FROM reminders WHERE id_reminder = ${results[0].id_reminder}`);
				interaction.editReply('Reminder deleted!');
            }

            conn.end();
        });
    }
}