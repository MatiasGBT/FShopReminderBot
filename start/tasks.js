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
        cron.schedule('*/10 * * * *', () => {
            axios.get('https://fshopreminder.onrender.com/')
                .then((response) => console.log("Refreshing"))
                .catch(error => console.log(error));
        });
    }
}