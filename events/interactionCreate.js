const { InteractionType } = require("discord.js");
const Karma = require("../models/karma.js");

module.exports = {
	name: "interactionCreate",
	once: false,
	async execute(bot, interaction) {
		if(interaction.type === InteractionType.MessageComponent) {
			if(interaction.customId === 'chest') {
				const chests = [
					{ name: 'Common', value: 2, type: 1 },
					{ name: 'Exquisite', value: 5, type: 2 },
					{ name: 'Precious', value: 10, type: 3 },
					{ name: 'Luxurious', value: 40, type: 4 }
				]

				let chest = chests.find(c => c.name == interaction.message.content.split(" ")[1]);

				await interaction.update({ content: `The ${chest.name} chest has been claimed by ${interaction.user.username}!`, components: [] });
				await interaction.followUp({ content: `You collected the ${chest.name} chest and got ${chest.value} things!`, ephemeral: true });

				Karma.findOne({
					user_id: interaction.member.user.id,
					guild_id: interaction.member.guild.id
				}, (err, karma) => {
					if(err) console.log(err);
		
					if(!karma) {
						const newKarma = new Karma({
							user_id: interaction.member.user.id,
							guild_id: interaction.member.guild.id,
							balance: chest.value
						});
		
						newKarma.save().then(err).catch(err => console.log(err));
					} else {
						karma.balance += chest.value;
						karma.save().catch(err => console.log(err));
					}
				});
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