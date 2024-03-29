const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallet = require('../models/wallet.js');
const Ranks = require('../ranks.json');

function getRandomInt(max) {
	return Math.floor(Math.random() * max);
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('coinflip')
		.setDescription('simple coinflip game')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('amount to gamble')
				.setRequired(true)),
	async execute(interaction) {
		let jackpotPercentage = 1;
		let jackpotMultiplier = 10;
		let winPercentage = 440;
		let rng = getRandomInt(1000);

		if(interaction.options._hoistedOptions[0].value <= 0) {
			interaction.reply(`Please gamble more than 0 coins.`);
			return;
		}

		const ranks = Object.keys(Ranks);
		for(let i = 0; i < ranks.length; i++) {
			if(interaction.member.roles.cache.find(role => role.name === Ranks[ranks[i]].name)) {
				winPercentage += Ranks[ranks[i]].coinFlipWinChance * 10;
				jackpotMultiplier += Ranks[ranks[i]].coinFlipJackpotMultiplier;
				jackpotPercentage += Ranks[ranks[i]].coinFlipJackpotChance * 10;
			}
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
			}

			wallet.save().catch(err => console.log(err));
		});
	}
}