const { Client, Collection, Intents } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const mongoose = require('mongoose');

const bot = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS],
	fetchAllMembers: true
});

//load commands
bot.commands = new Collection();
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.data.name, command);
	commands.push(command.data.toJSON());
}

//load events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
	const event = require(`./events/${file}`);
	if(event.once) {
		bot.once(event.name, (...args) => event.execute(bot, ...args));
	} else {
		bot.on(event.name, (...args) => event.execute(bot, ...args));
	}
}

//sync slash commands
const rest = new REST({ version: '9' }).setToken(config.token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		for(var i = 0; i < config.guildId.length; i++) {
			await rest.put(
				Routes.applicationGuildCommands(config.clientId, config.guildId[i]),
				{ body: commands },
			);
		}

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

//mongodb server connect
mongoose.connect(config.mongodb, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to MongoDB!')
}).catch((err) => {
	console.log('Unable to connect to MongoDB Database.\nError: ' + err)
});

//random event
/*let min = 30, max = 40;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
(async() => {
	while(true) {
		let timeminutes = Math.floor(Math.random() * (max - min) + min) * 1000;
		await sleep(timeminutes);
		const channel = await bot.channels.fetch("775779221766668339");
	}
})();*/

bot.login(config.token);
