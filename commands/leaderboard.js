const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const Wallet = require('../models/wallet.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('shows the leaderboard'),
	async execute(interaction) {
		Wallet.find({
			guild_id: interaction.guild.id
		}, (err, res) => {
			if(err) console.log(err);

			res.sort(function(a, b) {return b.balance - a.balance});

			let embed = new MessageEmbed()
				.setTitle("Leaderboard");

			if(res.length == 0) {
				embed.setColor("RED");
				embed.addField("No data found", "Please type in chat to earn coins!")
			} else if(res.length < 10) {
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
				for(i = 0; i < 10; i++) {
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

			interaction.reply({ embeds: [embed] });
		});
	}
}