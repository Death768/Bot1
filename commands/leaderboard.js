const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('shows the leaderboard')
		.addStringOption(option =>
			option.setName('selection')
				.setDescription('leaderboard sorting')
				.addChoice('Coins', 'coins')
				.addChoice('CPM', 'cpm')),
	async execute(interaction) {
		Wallet.find({
			guild_id: interaction.guild.id
		}, (err, res) => {
			if(err) console.log(err);

			let embed = new MessageEmbed()
				.setTitle("Leaderboard");

			let selectionOption = interaction.options.getString('selection');
			if(!selectionOption || selectionOption == 'coins') {
				res.sort(function(a, b) {return b.balance - a.balance});
				
				if(res.length == 0) {
					embed.setColor("RED");
					embed.addField("No data found", "Please type in chat to earn coins!")
				} else if(res.length < 5) {
					embed.setColor("BLURPLE");
					for(i = 0; i < res.length; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addField(`${i + 1}. ${member}`, `**Coins**: ${res[i].balance}`);
						} else if(member.nickname) {
							embed.addField(`${i + 1}. ${member.nickname}`, `**Coins**: ${res[i].balance}`);
						} else {
							embed.addField(`${i + 1}. ${member.user.username}`, `**Coins**: ${res[i].balance}`);
						}
					}
				} else {
					embed.setColor("BLURPLE");
					for(i = 0; i < 5; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addField(`${i + 1}. ${member}`, `**Coins**: ${res[i].balance}`);
						} else if(member.nickname) {
							embed.addField(`${i + 1}. ${member.nickname}`, `**Coins**: ${res[i].balance}`);
						} else {
							embed.addField(`${i + 1}. ${member.user.username}`, `**Coins**: ${res[i].balance}`);
						}
					}
				}
			} else if(selectionOption == 'cpm') {
				res.sort(function(a, b) {return b.coinsPerMessage - a.coinsPerMessage});

				if(res.length == 0) {
					embed.setColor("RED");
					embed.addField("No data found", "Please type in chat to earn coins!")
				} else if(res.length < 5) {
					embed.setColor("BLURPLE");
					for(i = 0; i < res.length; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addField(`${i + 1}. ${member}`, `**CPM**: ${res[i].coinsPerMessage}`);
						} else if(member.nickname) {
							embed.addField(`${i + 1}. ${member.nickname}`, `**CPM**: ${res[i].coinsPerMessage}`);
						} else {
							embed.addField(`${i + 1}. ${member.user.username}`, `**CPM**: ${res[i].coinsPerMessage}`);
						}
					}
				} else {
					embed.setColor("BLURPLE");
					for(i = 0; i < 5; i++) {
						let member = interaction.guild.members.cache.get(res[i].user_id) || "User Not Found";
						if(member == "User Not Found") {
							embed.addField(`${i + 1}. ${member}`, `**CPM**: ${res[i].coinsPerMessage}`);
						} else if(member.nickname) {
							embed.addField(`${i + 1}. ${member.nickname}`, `**CPM**: ${res[i].coinsPerMessage}`);
						} else {
							embed.addField(`${i + 1}. ${member.user.username}`, `**CPM**: ${res[i].coinsPerMessage}`);
						}
					}
				}
			}

			interaction.reply({ embeds: [embed] });
		});
	}
}