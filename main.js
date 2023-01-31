const { Client, Collection, GatewayIntentBits, ActionRow, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('./config.json');
const fs = require('node:fs');
const mongoose = require('mongoose');

const bot = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers],
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

//mongodb server connect
mongoose.connect(config.mongodb, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log('Connected to MongoDB!')
}).catch((err) => {
	console.log('Unable to connect to MongoDB Database.\nError: ' + err)
});

const chests = [
	{ name: 'Common', value: 2, type: 1 },
	{ name: 'Exquisite', value: 5, type: 2 },
	{ name: 'Precious', value: 10, type: 3 },
	{ name: 'Luxurious', value: 40, type: 4 }
]

//refactor asap
function weights(number) {
	if(number < 65) {
		return 0;
	} else if(number < 90) {
		return 1;
	} else if(number < 99) {
		return 2;
	} else {
		return 3;
	}
}

let minMinutes = 20, maxMinutes = 30;
const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
(async() => {
	while(true) {
		let timeInMinutes = Math.random() * (maxMinutes - minMinutes) + minMinutes;
		await sleep(timeInMinutes * 60 * 1000);
		const channel = await bot.channels.fetch("775779221766668339");
		let chestSpawn = Math.floor(Math.random() * 100);
		let chest = chests[weights(chestSpawn)];

		const button = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('chest')
					.setLabel(`Claim ${chest.name} chest!`)
					.setStyle(ButtonStyle.Primary)
			);

		await channel.send({ content: `${chest.type == 2 ? `An` : `A`} ${chest.name} chest has appeared! Click the button to claim it!`, components: [button] });
	}
})();

bot.login(config.token);
