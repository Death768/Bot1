const User = require('../models/user.js');
const Wallet = require('../models/wallet.js');
const word = require('../word.json');
const fs = require('fs');

const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));

module.exports = {
	name: "messageCreate",
	once: false,
	async execute(bot, message) {
		//input random word
		/*if(message.author.id === bot.user.id) {
			if(!message.content.startsWith('Type')) return;
			let w = message.content.slice(4).trim().split(/\s+/);

			let input = {
				word: w
			};
			await fs.writeFile("../word.json", JSON.stringify(input), err => {
				if (err) console.log("Error writing file:", err);
			});

			await sleep(30 * 1000);
			message.delete();

			input = {
				word: ""
			};
			await fs.writeFile("../word.json", JSON.stringify(word), err => {
				if (err) console.log("Error writing file:", err);
			});
			return;
		}*/

		if(message.author.bot) return;
		
		//check if get karma
		/*fs.readFile("../word.json", "utf8", (err, jsonString) => {
			if (err) {
				console.log("File read failed:", err);
				return;
			}
			try {
				const word = JSON.parse(jsonString);
				if(message.content == word.word[0]) {
					message.reply(`You typed the word first! You get 1 karma.`);

					input = {
						word: ""
					};
					fs.writeFile("../word.json", JSON.stringify(word), err => {
						if (err) console.log("Error writing file:", err);
					});
				}
			} catch (err) {
				console.log("Error parsing JSON string:", err);
			}
		});*/
		

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