const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('shows your balance')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('check user\'s balance')),
	async execute(interaction) {
		let target = interaction.options._hoistedOptions[0] || interaction;

		if(target.user.bot) {
			interaction.reply(`You cannot check the balance of a bot.`);
			return;
		}
		Wallet.findOne({
			user_id: target.user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			let embed = new EmbedBuilder()
				.setColor(target.member.displayHexColor)
				.setTitle("Balance")
				.setThumbnail(target.user.displayAvatarURL());

			if(!wallet) {
				embed.addFields([
					{ name: 'Coins', value: '0' },
					{ name: 'Coins Per Message', value: '1' }
				]);
			} else {
				embed.addFields([
					{ name: 'Coins', value: wallet.balance.toString() },
					{ name: 'Coins Per Message', value: wallet.coinsPerMessage.toString() }
				]);
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}