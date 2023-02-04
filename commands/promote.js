const { SlashCommandBuilder } = require('@discordjs/builders');
const Karma = require('../models/karma.js');
const Ranks = require('../ranks.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('promote')
		.setDescription('attempt to promote to the next rank'),
	async execute(interaction) {
		Karma.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}).then(karma => {
			const ranks = Object.keys(Ranks);

			let found = false;
			let nextRank = Ranks[ranks[0]];
			let currRank = null;
			for(let i = 0; i < ranks.length; i++) {
				if(interaction.member.roles.cache.find(role => role.name === Ranks[ranks[i]].name)) {
					found = true;
					nextRank = Ranks[ranks[i + 1]];
					currRank = Ranks[ranks[i]];
				}
			}

			if(found && nextRank === Ranks[ranks[0]]) nextRank = "";

			if(nextRank === "") {
				interaction.reply('You are already at the highest rank.');
				return;
			}

			if(karma.karma < nextRank.karmaReq) {
				interaction.reply(`You do not have enough karma to promote, you need ${nextRank.karmaReq} karma.`);
				return;
			}

			interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name === nextRank.name));
			if(currRank) interaction.member.roles.remove(interaction.guild.roles.cache.find(role => role.name === currRank.name));

			interaction.reply(`You have promoted to ${nextRank.name}!`);
		}).catch(err => console.log(err));
	}
}