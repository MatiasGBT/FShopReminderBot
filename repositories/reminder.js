const Connector = require('../connector');
const axios = require('axios');

module.exports = class ReminderRepository {
    static createReminder(interaction) {
        const skinName = interaction.options.getString('name') ?? '';
        axios.get('https://fortnite-api.com/v2/cosmetics/br/search?name=' + skinName)
            .then(function (response) {
                let conn = Connector.startConnection();
                conn.query(`INSERT INTO reminder (user, skin) VALUES ('${interaction.client.user.id}', '${response.data.data.name}')`);
                conn.end();
                interaction.editReply('Reminder created!');
            })
            .catch(function (error) {
                interaction.editReply('Error, the selected skin does not exist');
            });
    }
}