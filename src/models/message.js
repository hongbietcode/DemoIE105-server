const mongoose = require("mongoose");

const {Schema} = mongoose;

const messagesSchema = new Schema({
	user: {
		type: String,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
	payload: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("Message", messagesSchema, "Messages");
