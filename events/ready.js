const config = require('../config.json');

module.exports = {
	name: 'ready',
	once: true,
	execute(bot) {
		console.log(`Logged in as ${bot.user.tag}!`);
		//cache all members
		const Guilds = bot.guilds.cache.map(guild => guild.id);
		for(const guild of Guilds) {
			bot.guilds.fetch(guild).then((guild) => { guild.members.fetch() });
		}
	}
}