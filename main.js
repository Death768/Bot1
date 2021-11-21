const { Client, Intents } = require('discord.js');
const { token } = require('./token.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for(const file of eventFiles) {
	const event = require(`./events/${file}`);
	if(event.once) {
		bot.once(event.name, (...args) => event.execute(...args));
	} else {
		bot.on(event.name, (...args) => event.execute(...args));
	}
}

const clientId = '726923787005722768';
const guildId = '758786724767334421';

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

bot.login(token);