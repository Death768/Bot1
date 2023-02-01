const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallet = require('../models/wallet.js');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('diceroll')
		.setDescription('roll two dice')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('amount to gamble')
				.setRequired(true)),
	async execute(interaction) {
		//role two dice from 1-6
		const dice1 = getRandomInt(6) + 1;
		const dice2 = getRandomInt(6) + 1;
		const total = dice1 + dice2;

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
			} else {
				let balanceChange = Math.round((0.044*Math.pow(total, 1.564) - 1.129) * interaction.options._hoistedOptions[0].value);
				if(balanceChange > 0) {
					wallet.balance += balanceChange;
					interaction.reply(`You won ${balanceChange} coins.`);
				} else {
					wallet.balance += balanceChange;
					interaction.reply(`You lost ${-balanceChange} coins.`);
				}
			}

			wallet.save().catch(err => console.log(err));
		});
	}
}