const mongoose = require("mongoose");

const {Schema} = mongoose;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	username: {
		type: String,
		unique: true,
		require: true,
	},
	password: {
		type: String,
		required: true,
	},
	salt: {
		type: String,
		required: true,
	},
	secretKey: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("User", userSchema, "User");
