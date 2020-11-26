const express = require("express");
const route = express.Router();

const user = require("./controllers/userController");
const auth = require("./controllers/authController");

const Message = require("./models/message");
const AES = require("./Cryptos/AESCrypto");

route.post("/user", user.createUser);
route.get("/users", user.getAllUser);
route.delete("/user", user.removeUser);

route.post("/login", auth.login);
route.get("/messages", auth.auth, (req, res) => {
	var messages = [];
	Message.find({}).then((listMessages) => {
		listMessages.forEach((message) => {
			messages = [message, ...messages];
		});

		const encrypt = AES.encrypt(messages, req.userId);
		res.json(encrypt);
	});
});

route.get("/secret", auth.auth, (req, res) => {
	res.json({
		user: req.userId,
		success: true,
	});
});

route.get("/key", (req, res) => {
	console.log("🧑   The new user connect with safe mode");
	console.log("💌💌💌   Sending RSA public key . . .");
	const public = require("./Cryptos/RSACrypto").Key.publicKey;
	res.json({
		key: public,
	});
});

module.exports = route;
