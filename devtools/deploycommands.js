const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');
const config = require('../config.json');
const fs = require('node:fs');

const commands = [];
const commandFiles = fs.readdirSync('../commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

//sync slash commands
const rest = new REST({ version: '10' }).setToken(config.token);
(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();