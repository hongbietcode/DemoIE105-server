const User = require("../models/user");
const hashPassword = require("../Cryptos/SHA256Hash");

const createUser = (req, res) => {
	if (
		req.body.username == undefined ||
		req.body.password == undefined ||
		req.body.name == undefined ||
		req.body.secretKey == undefined ||
		req.body.avatar == undefined
	)
		return res.status(500).json({
			success: false,
			message: "require",
		});

	//create salt password
	const {salt, passwordDigit} = hashPassword(req.body.password);

	const user = new User({
		name: req.body.name,
		username: req.body.username,
		password: passwordDigit,
		salt: salt,
		secretKey: req.body.secretKey,
		avatar: req.body.avatar,
	});

	return user
		.save()
		.then((newUser) => {
			return res.status(201).json({
				success: true,
				message: "new user created successfully",
				user: newUser,
			});
		})
		.catch((err) => {
			res.status(500).json({
				success: false,
				message: "server error. Please try again",
				error: err.message,
			});
		});
};

// const getUser = (req, res) => {
// 	User.findById(req.cookies.abc).then((user) => res.send(user));
// };

const getAllUser = (req, res) => {
	User.find({}).then((users) => {
		const result = [];
		users.map((user) =>
			result.push({
				userId: user._id,
				name: user.name,
				avatar: user.avatar,
				online: req.query.id == user._id ? true : false,
			})
		);
		res.send(result);
	});
};

const removeUser = (req, res) => {
	if (req.body.id === undefined)
		return res.status(500).json({
			success: false,
			message: "require",
		});

	User.findByIdAndDelete({_id: req.body.id}).then((doc) => {
		res.send(doc);
	});
};
module.exports = {createUser, getAllUser, removeUser};
