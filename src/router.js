const express = require("express");
const route = express.Router();

const user = require("./controllers/userController");
const auth = require("./controllers/authController");

const Message = require("./models/message");
const AES = require("./Cryptos/AESCrypto");
const RSA = require("./Cryptos/RSACrypto");
const DF = require("./Cryptos/DiffieHellman");

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
	console.log("💌💌💌   Sending DF server public key . . .");

	const rsaPublicKey = RSA.Key.publicKey;
	const dfServerPublicKey = DF.Server.getPublicKey();

	const DF_Server = {
		prime: DF.Server.getPrime(),
		generator: DF.Server.getGenerator(),
		privateKey: DF.Server.getPrivateKey(),
		publicKey: DF.Server.getPublicKey(),
	};

	console.log(" DF_Server[Base64]", DF_Server);

	res.json({
		rsaPublicKey: rsaPublicKey,
		dfServerPublicKey: dfServerPublicKey,
	});
});

module.exports = route;
