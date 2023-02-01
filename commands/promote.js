const { SlashCommandBuilder } = require('@discordjs/builders');
const Karma = require('../models/karma.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('promote')
		.setDescription('attempt to promote to the next rank'),
	async execute(interaction) {
		Karma.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}).then(karma => {
			const ranks = [
				{ name: 'Commoner', karma: 150 },
				{ name: 'Artisan', karma: 300 },
				{ name: 'Vassal', karma: 550 },
				{ name: 'Noble', karma: 900 },
				{ name: 'Royal', karma: 1350 }
			];

			let nextRank = 0;
			for(let i = 0; i < ranks.length; i++) {
				if(interaction.member.roles.cache.find(role => role.name === ranks[i].name)) {
					nextRank = i + 1;
					break;
				}
			}

			if(nextRank === ranks.length) {
				interaction.reply('You are already at the highest rank.');
				return;
			}

			if(karma.karma < ranks[nextRank].karma) {
				interaction.reply(`You do not have enough karma to promote, you need ${ranks[nextRank].karma} karma.`);
				return;
			}

			interaction.member.roles.add(interaction.guild.roles.cache.find(role => role.name === ranks[nextRank].name));

			interaction.reply(`You have promoted to ${ranks[nextRank].name}!`);
		}).catch(err => console.log(err));
	}
}