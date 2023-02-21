# Fortnite Shop Reminder Bot

Fortnite Shop Reminder is a Discord bot that notifies you when a desired skin appears in the game's daily shop.

## Getting Started

First of all, invite the bot to your server by [clicking here](https://discord.com/api/oauth2/authorize?client_id=1073615681104379974&permissions=3072&scope=bot).
With the bot on your server, you can create a reminder using the command `/remind_me skin-name` (replace skin-name with the name of the desired skin).
If everything goes correctly, the bot will respond to the command with the caption "Reminder created!". Each user can create unlimited reminders.

The bot checks the in-game store every day approximately 15 minutes after it is updated and notifies (with a private Discord message) all users who have created a reminder if any of the desired skins are released in the store.

If you want to delete a reminder just use the command `/delete_reminder skin-name` (replace skin-name with the name of the undesired skin). By doing this the bot will no longer notify you if a skin that you previously wanted appears in the store.
