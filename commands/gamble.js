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
		const jackpotPercentage = 10;
		const jackpotMultiplier = 7;
		const winPercentage = 3500;
		let rng = getRandomInt(10000);

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

			if(rng <= jackpotPercentage) {
				wallet.balance += interaction.options._hoistedOptions[0].value * jackpotMultiplier;
				interaction.reply(`Jackpot! You just won ${jackpotMultiplier * interaction.options._hoistedOptions[0].value} coins!`);
			} else if(rng <= winPercentage) {
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