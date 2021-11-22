const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('shows your balance'),
	async execute(interaction) {
		Wallet.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			let embed = new MessageEmbed()
				.setColor(interaction.member.displayHexColor)
				.setTitle("Balance")
				.setThumbnail(interaction.user.displayAvatarURL());

			if(!wallet) {
				embed.addField("Coins", 0, true);
			} else {
				embed.addField("Coins", wallet.balance.toString(), true);
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}