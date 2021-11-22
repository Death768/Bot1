const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	user_id: {
		type: String
	},
	guild_id: {
		type: String
	}
});

module.exports = mongoose.model("User", userSchema);