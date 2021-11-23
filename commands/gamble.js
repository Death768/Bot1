const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Wallet = require('../models/wallet.js');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('gamble')
		.setDescription('gamble money')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('amount to gamble')
				.setRequired(true)),
	async execute(interaction) {
		const winPercentage = 35000;
		let rng = getRandomInt(100000);

		if(interaction.options._hoistedOptions[0].value <= 0) {
			interaction.reply(`Please gamble more than 0 coins.`);
			return;
		}

		Wallet.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			if(interaction.options._hoistedOptions[0].value > wallet.balance) {
				interaction.reply(`You do not have that many coins.`);
				return;
			}

			if(rng <= winPercentage) {
				wallet.balance += interaction.options._hoistedOptions[0].value;
				interaction.reply(`You won ${interaction.options._hoistedOptions[0].value} coins.`);
			} else {
				wallet.balance -= interaction.options._hoistedOptions[0].value;
				interaction.reply(`You lost ${interaction.options._hoistedOptions[0].value} coins.`);
			}

			wallet.save().catch(err => console.log(err));
		});
	}
}