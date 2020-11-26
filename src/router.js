const express = require("express");

const user = require("./controllers/userController");
const auth = require("./controllers/authController");

const route = express.Router();

route.post("/user", user.createUser);
route.get("/users", user.getAllUser);
route.delete("/user", user.removeUser);
route.post("/login", auth.login);
route.get("/secret", auth.auth, (req, res) => {
	res.json({
		user: req.user,
		success: true,
	});
});
route.get("/key", (req, res) => {
	const public = require("./Cryptos/RSACrypto").Key.publicKey;
	res.json({
		key: public,
	});
});

module.exports = route;
