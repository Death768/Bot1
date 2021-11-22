const User = require('../models/user.js');

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(bot, message) {
		User.findOne({
			user_id: message.author.id,
			guild_id: message.guild.id
		}, (err, user) => {
			if(err) console.log(err);

			if(!user) {
				const newUser = new User({
					user_id: message.author.id,
					guild_id: message.guild.id
				});

				newUser.save().then(err).catch(err => console.log(err));
			}
		})
	}
}