const config = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		console.log(`Logged in as ${bot.user.tag}!`);
		//cache all members
		for(var i = 0; i < config.guildId.length; i++) {
			bot.guilds.fetch(config.guildId[i]).then((guild) => { guild.members.fetch() });
		}
	}
}