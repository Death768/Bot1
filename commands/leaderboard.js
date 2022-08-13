const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('shows the leaderboard')
		.addStringOption(option =>
			option.setName('selection')
				.setDescription('leaderboard sorting')
				.addChoices(
					{ name: 'Coins', value: 'coins' },
					{ name: 'CPM', value: 'cpm' }
				)),
	async execute(interaction) {
		Wallet.find({
			guild_id: interaction.guild.id
		}, (err, res) => {
			if(err) console.log(err);

			let embed = new EmbedBuilder()
				.setTitle("Leaderboard");

			let selectionOption = interaction.options.getString('selection');
			if(!selectionOption || selectionOption == 'coins') {
				res.sort(function(a, b) {return b.balance - a.balance});
				
				if(res.length == 0) {
					embed.setColor("Red");
					embed.addField("No data found", "Please type in chat to earn coins!")
				} else if(res.length < 5) {
					embed.setColor("Blurple");
					for(i = 0; i < res.length; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addFields([
								{ name: `${i + 1}. ${member}`, value: `**Coins**: ${res[i].balance}` }
							]);
						} else if(member.nickname) {
							embed.addFields([
								{ name: `${i + 1}. ${member.nickname}`, value: `**Coins**: ${res[i].balance}` }
							]);
						} else {
							embed.addFields([
								{ name: `${i + 1}. ${member.user.username}`, value: `**Coins**: ${res[i].balance}` }
							]);
						}
					}
				} else {
					embed.setColor("Blurple");
					for(i = 0; i < 5; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addFields([
								{ name: `${i + 1}. ${member}`, value: `**Coins**: ${res[i].balance}` }
							]);
						} else if(member.nickname) {
							embed.addFields([
								{ name: `${i + 1}. ${member.nickname}`, value: `**Coins**: ${res[i].balance}` }
							]);
						} else {
							embed.addFields([
								{ name: `${i + 1}. ${member.user.username}`, value: `**Coins**: ${res[i].balance}` }
							]);
						}
					}
				}
			} else if(selectionOption == 'cpm') {
				res.sort(function(a, b) {return b.coinsPerMessage - a.coinsPerMessage});

				if(res.length == 0) {
					embed.setColor("Red");
					embed.addField("No data found", "Please type in chat to earn coins!")
				} else if(res.length < 5) {
					embed.setColor("Blurple");
					for(i = 0; i < res.length; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addFields([
								{ name: `${i + 1}. ${member}`, value: `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						} else if(member.nickname) {
							embed.addFields([
								{ name: `${i + 1}. ${member.nickname}`, value : `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						} else {
							embed.addFields([
								{ name : `${i + 1}. ${member.user.username}`, value: `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						}
					}
				} else {
					embed.setColor("Blurple");
					for(i = 0; i < 5; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addFields([
								{ name: `${i + 1}. ${member}`, value: `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						} else if(member.nickname) {
							embed.addFields([
								{ name: `${i + 1}. ${member.nickname}`, value: `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						} else {
							embed.addFields([
								{ name: `${i + 1}. ${member.user.username}`, value: `**CPM**: ${res[i].coinsPerMessage}` }
							]);
						}
					}
				}
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}