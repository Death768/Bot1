const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, InviteGuild } = require('discord.js');
const Wallet = require('../models/wallet.js');
const Karma = require('../models/karma.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('shows the leaderboard')
		.addStringOption(option =>
			option.setName('selection')
				.setDescription('leaderboard sorting')
				.addChoices(
					{ name: 'Coins', value: 'balance' },
					{ name: 'CPM', value: 'coinsPerMessage' },
					{ name: 'Karma', value: 'karma' }
				)),
	async execute(interaction) {
		let embed = new EmbedBuilder()
		.setTitle("Leaderboard");

		let selectionOption = interaction.options.getString('selection') ?? 'balance';

		let optionTypes = [
			{ name: 'Coins', value: 'balance' },
			{ name: 'CPM', value: 'coinsPerMessage' },
			{ name: 'Karma', value: 'karma' }
		]

		let selectionName = optionTypes.find(c => c.value == selectionOption).name;
		let selectionType;

		if(selectionName === 'Coins' || selectionName === 'CPM') {
			selectionType = Wallet;
		} else if(selectionName === 'Karma') {
			selectionType = Karma;
		}

		selectionType.find({
			guild_id: interaction.guild.id
		}, (err, res) => {
			if(err) console.log(err);
			
			res.sort(function(a, b) {return b[selectionOption] - a[selectionOption]});
				
			if(res.length == 0) {
				embed.setColor("Red");
				embed.addField("No data found", "Please type in chat to earn coins!")
			} else if(res.length < 5) {
				embed.setColor("Blurple");
				for(i = 0; i < res.length; i++) {
					let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
					if(member == "User Not Found") {
						embed.addFields([
							{ name: `${i + 1}. ${member}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					} else if(member.nickname) {
						embed.addFields([
							{ name: `${i + 1}. ${member.nickname}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					} else {
						embed.addFields([
							{ name: `${i + 1}. ${member.user.username}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					}
				}
			} else {
				embed.setColor("Blurple");
				for(i = 0; i < 5; i++) {
					let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
					if(member == "User Not Found") {
						embed.addFields([
							{ name: `${i + 1}. ${member}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					} else if(member.nickname) {
						embed.addFields([
							{ name: `${i + 1}. ${member.nickname}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					} else {
						embed.addFields([
							{ name: `${i + 1}. ${member.user.username}`, value: `**${selectionName}**: ${res[i][selectionOption]}` }
						]);
					}
				}
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}