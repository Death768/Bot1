const User = require('../models/user.js');
const Wallet = require('../models/wallet.js');
const Ranks = require('../ranks.json');

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(bot, message) {
		if(message.author.bot) return;

		User.findOne({
			user_id: message.author.id,
			guild_id: message.guild.id
		}).then(user => {
			if(!user) {
				const newUser = new User({
					user_id: message.author.id,
					guild_id: message.guild.id
				});

				newUser.save().then(err).catch(err => console.log(err));
			}
		}).catch(err => console.log(err));

		const ranks = Object.keys(Ranks);

		let multiplier = 1;
		for(let i = 0; i < ranks.length; i++) {
			if(message.member.roles.cache.find(role => role.name === Ranks[ranks[i]].name)) {
				multiplier = Ranks[ranks[i]].cpmMultiplier;
			}
		}

		Wallet.findOne({
			user_id: message.author.id,
			guild_id: message.guild.id
		}).then(wallet => {
			if(!wallet) {
				const newWallet = new Wallet({
					user_id: message.author.id,
					guild_id: message.guild.id
				});

				newWallet.save().then(err).catch(err => console.log(err));
			} else {
				wallet.balance += Math.round(wallet.coinsPerMessage * multiplier);
				wallet.save().catch(err => console.log(err));
			}
		}).catch(err => console.log(err));
	}
}