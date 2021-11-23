const config = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		console.log(`Logged in as ${bot.user.tag}!`);
		//cache all members
		bot.guilds.fetch(config.guildId).then((guild) => { guild.members.fetch() });
	}
}