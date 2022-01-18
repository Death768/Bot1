const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('upgrade')
		.setDescription('upgrade the amount of coins per message you get'),
	async execute(interaction) {
		Wallet.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			let cost = 2147483647;
			if(wallet.coinsPerMessage < 50) {
				cost = 100 * wallet.coinsPerMessage;
			} else if(wallet.coinsPerMessage < 200) {
				cost = 2000 * wallet.coinsPerMessage - 95000;
			}

			if(cost > wallet.balance) {
				interaction.reply(`You do not have that many coins. You need ${cost} coins.`);
				return;
			}

			wallet.balance -= cost;
			wallet.coinsPerMessage++;

			wallet.save().catch(err => console.log(err));
			interaction.reply(`You have upgraded to ${wallet.coinsPerMessage}, spending ${cost} coins.`);
		});
	}
}