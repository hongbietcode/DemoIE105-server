const jwt = require("jsonwebtoken");
const User = require("../models/user");
const hashPassword = require("../Cryptos/SHA256Hash");
const RSA = require("../Cryptos/RSACrypto");
const AES = require("../Cryptos/AESCrypto");

const login = (req, res) => {
	try {
		//NOTE neu su dung rsa thi giai ma
		if (req.body.rsa) {
			var result = JSON.parse(RSA.Decrypting(req.body.rsa, RSA.Key.privateKey, "utf8"));
			req.body = result;
		}

		//NOTE kiem tra khong xac dinh (neu giai ma khong thanh cong hoac khong truyen du lieu)
		if (req.body.username == undefined || req.body.password == undefined)
			return res.status(500).json({
				success: false,
				message: "username or password is required",
			});

		//NOTE tim user co username nam trong request
		User.findOne({username: req.body.username}).then((user) => {
			if (user === null)
				res.status(500).json({
					success: false,
					message: "username or password is invalid",
				});
			else {
				const {passwordDigit} = hashPassword(req.body.password, user.salt);
				if (passwordDigit === user.password) {
					//NOTE create token and AES key
					const token = jwt.sign({id: user.id}, process.env.SECRET_KEY);

					// TODO safe mode
					if (req.body.clientKey) {
						const clientKey = req.body.clientKey;

						AES.generateSecretKey(clientKey, user._id);

						const data = {
							message: "login successful",
							token: token,
							user: {
								id: user._id,
								username: user.username,
								name: user.name,
							},
						};

						//encrypt data with AES encryption
						const cipherText = AES.encrypt(data, user.id);

						res.json({
							aes: cipherText,
						});
					}
					//TODO unsafe mode
					else {
						res.json({
							message: "login successful",
							token: token,
							user: {
								id: user._id,
								username: user.username,
								name: user.name,
							},
						});
					}
				} else
					res.status(500).json({
						success: false,
						message: "username or password is invalid",
					});
			}
		});
	} catch (err) {
		res.status(500).json({
			error: err.message,
		});
	}
};

const auth = (req, res, next) => {
	try {
		const token = req.header("x-auth-token");
		console.log("token : ", token);
		if (!token)
			return res.status(401).json({
				message: "token is missing",
			});

		const verified = jwt.verify(token, process.env.SECRET_KEY);
		if (!verified)
			return res.status(401).json({
				message: "Unauthorized",
			});

		req.userId = verified.id;
		next();
	} catch (err) {
		res.status(500).json({
			error: err.message,
		});
	}
};

module.exports = {login, auth};
