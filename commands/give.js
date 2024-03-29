const { SlashCommandBuilder } = require('@discordjs/builders');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('give')
		.setDescription('give money')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('user to give to')
				.setRequired(true))
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('amount to give')
				.setRequired(true)),
	async execute(interaction) {
		if(interaction.options._hoistedOptions[0].user.id == interaction.user.id) {
			interaction.reply(`You cannot donate to yourself.`);
			return;
		}
		if(interaction.options._hoistedOptions[0].user.bot) {
			interaction.reply(`You cannot donate to a bot.`);
			return;
		}
		if(interaction.options._hoistedOptions[1].value <= 0) {
			interaction.reply(`You cannot donate a negative amount.`);
			return;
		}

		let aborted = false;
		Wallet.findOne({
			user_id: interaction.user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			if(interaction.options._hoistedOptions[1].value > wallet.balance) {
				interaction.reply(`You do not have that many coins.`);
				aborted = true;
				return;
			}

			wallet.balance -= interaction.options._hoistedOptions[1].value;
			wallet.save().catch(err => console.log(err));
		});

		Wallet.findOne({
			user_id: interaction.options._hoistedOptions[0].user.id,
			guild_id: interaction.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			if(!aborted) {
				wallet.balance += interaction.options._hoistedOptions[1].value;
				wallet.save().catch(err => console.log(err));

				let givername = interaction.guild.members.cache.get(interaction.user.id).nickname || interaction.guild.members.cache.get(interaction.user.id).user.username;
				let recievername = interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].user.id).nickname || interaction.guild.members.cache.get(interaction.options._hoistedOptions[0].user.id).user.username || "User Not Found";
				interaction.reply(`${givername}, you transferred ${interaction.options._hoistedOptions[1].value} to ${recievername}.`);
			}
		});

		if(aborted) {
			interaction.reply(`Transaction failed for unknown reasons.`);
		}
	}
}