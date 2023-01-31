const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Wallet = require('../models/wallet.js');
const Karma = require('../models/karma.js');

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

		let embed = new EmbedBuilder()
			.setColor(target.member.displayHexColor)
			.setTitle("Balance")
			.setThumbnail(target.user.displayAvatarURL());

		await Wallet.findOne({
			user_id: target.user.id,
			guild_id: interaction.guild.id
		}).then(wallet => {
			if(!wallet) {
				embed.addFields([
					{ name: 'Coins', value: '0' },
					{ name: 'Coins Per Message', value: '1' },
				]);
			} else {
				embed.addFields([
					{ name: 'Coins', value: wallet.balance.toString() },
					{ name: 'Coins Per Message', value: wallet.coinsPerMessage.toString() }
				]);
			}
		}).catch(err => console.log(err));

		await Karma.findOne({
			user_id: target.user.id,
			guild_id: interaction.guild.id
		}).then(karma => {
			if(!karma) {
				embed.addFields([
					{ name: 'Karma', value: '0' }
				]);
			} else {
				embed.addFields([
					{ name: 'Karma', value: karma.balance.toString() }
				]);
			}
		}).catch(err => console.log(err));			

		await interaction.reply({ embeds: [embed] });
	}
}