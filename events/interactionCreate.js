const { InteractionType } = require("discord.js");
const Karma = require("../models/karma.js");
const Ranks = require("../ranks.json");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(bot, interaction) {
		if(interaction.type === InteractionType.MessageComponent) {
			if(interaction.customId === 'chest') {
				const chests = [
					{ name: 'Common', value: 2, type: 0 },
					{ name: 'Exquisite', value: 5, type: 1 },
					{ name: 'Precious', value: 10, type: 2 },
					{ name: 'Luxurious', value: 40, type: 3 }
				]

				let chest = chests.find(c => c.name == interaction.message.content.split(" ")[1]);

				await interaction.update({ content: `The ${chest.name} chest has been claimed by ${interaction.user.username}!`, components: [] });

				const ranks = Object.keys(Ranks);

				let coefficient = 0;
				let scalar = 0;
				let exponent = 0;
				for(let i = 0; i < ranks.length; i++) {
					if(interaction.member.roles.cache.find(role => role.name === Ranks[ranks[i]].name)) {
						coefficient = Ranks[ranks[i]].karmaCoefficient;
						scalar = Ranks[ranks[i]].karmaScalar;
						exponent = Ranks[ranks[i]].karmaExponent;
					}
				}

				let amt = chest.value + Math.round(coefficient * Math.pow(chest.value, exponent) - scalar);

				Karma.findOne({
					user_id: interaction.member.user.id,
					guild_id: interaction.member.guild.id
				}, (err, karma) => {
					if(err) console.log(err);
		
					if(!karma) {
						const newKarma = new Karma({
							user_id: interaction.member.user.id,
							guild_id: interaction.member.guild.id,
							karma: chest.value
						});
		
						newKarma.save().then(err).catch(err => console.log(err));
					} else {
						karma.karma += amt;
						karma.save().catch(err => console.log(err));
					}
				});

				await interaction.followUp({ content: `You collected the ${chest.name} chest and got ${amt} karma!`, ephemeral: true });
			}
		} else if(interaction.type == InteractionType.ApplicationCommand) {
			const command = bot.commands.get(interaction.commandName);

			if(!command) return;

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			}
		}
	}
}