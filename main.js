const { Client, Intents } = require('discord.js');
const { token } = require('./token.json');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once('ready', () => {
	console.log(`Ready!`);
});

bot.login(token);