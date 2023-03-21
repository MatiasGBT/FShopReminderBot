module.exports = class Tasks {
    static startTasks(client) {
        const cron = require('node-cron');
        const axios = require('axios');
        const Connector = require('../connector');

        cron.schedule('15 0 * * *', () => {
            console.log('Checking daily shop');
            getDailyShopItems();
        });

        async function getDailyShopItems() {
            const response = await axios.get('https://fortnite-api.com/v2/shop/br/combined');
            const dailyShopItems = response.data.data.featured.entries
                .concat(response.data.data.daily.entries)
                .filter(dailyShopItem => dailyShopItem.bundle == null);
            const reminders = await getReminders(dailyShopItems);
            notifyUsers(reminders);
        }

        //For each item in the daily shop, a promise is created if there is a reminder in the database for that item.
        async function getReminders(dailyShopItems) {
            let conn = Connector.startConnection();
            const promises = dailyShopItems.flatMap(entry => entry.items).map(item => {
                item.name = item.name.replaceAll('"', '');
                return new Promise((resolve, reject) => {
                    conn.query(`SELECT * FROM reminders WHERE skin_name = "${item.name}"`, function (error, results, fields) {
                        error ? reject(error) : resolve(results);
                    });
                });
            });
            conn.end();
            //Promise.all() avoids having to use a for loop for each item in the shop, executing all queries at once and improving performance.
            const results = await Promise.all(promises);
            return results.flat().filter(Boolean);
        }

        //Notifies (sends a private message) to users if a desired skin appeared in the daily shop.
        function notifyUsers(reminders) {
            reminders.forEach(reminder => {
                client.users.send(reminder.user_id, reminder.skin_name + ' is in the daily shop! Date: ' + new Date().toLocaleDateString('en-US'));
            });
        }

        //This task sends the endpoint created above an alert every 20 minutes so that the bot does
        //not "sleep" due to the Free Render Plan.
        cron.schedule('*/10 * * * *', () => {
            axios.get('https://fshopreminder.onrender.com/')
                .then((response) => console.log("Refreshing"))
                .catch(error => console.log(error));
        });
    }
}