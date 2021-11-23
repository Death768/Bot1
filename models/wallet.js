const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
	user_id: {
		type: String
	},
	guild_id: {
		type: String
	},
	balance: {
		type: Number,
		default: 0
	}
});

module.exports = mongoose.model("Wallet", walletSchema);