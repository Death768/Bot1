const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
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

			let embed = new MessageEmbed()
				.setColor(target.member.displayHexColor)
				.setTitle("Balance")
				.setThumbnail(target.user.displayAvatarURL());

			if(!wallet) {
				embed.addField("Coins", '0', true);
				embed.addField("Coins Per Message", "1", true);
			} else {
				embed.addField("Coins", wallet.balance.toString(), true);
				embed.addField("Coins Per Message", wallet.coinsPerMessage.toString(), true);
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}