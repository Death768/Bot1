const User = require('../models/user.js');
const Wallet = require('../models/wallet.js');
const fs = require('fs');

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(bot, message) {
		if(message.author.bot) return;

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
		});

		Wallet.findOne({
			user_id: message.author.id,
			guild_id: message.guild.id
		}, (err, wallet) => {
			if(err) console.log(err);

			if(!wallet) {
				const newWallet = new Wallet({
					user_id: message.author.id,
					guild_id: message.guild.id
				});

				newWallet.save().then(err).catch(err => console.log(err));
			} else {
				wallet.balance += wallet.coinsPerMessage;
				wallet.save().catch(err => console.log(err));
			}
		});
	}
}