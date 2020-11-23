const sha256 = require("crypto-js/sha256");
const Base64 = require("crypto-js/enc-base64");

const hashPassword = (password, salt) => {
	const randomSalt = salt ?? Base64.parse(Math.ceil(Math.random() * 10 ** 16).toString());
	const hashPassword = Base64.stringify(sha256(password + randomSalt + process.env.PEPPER_KEY));

	return {
		salt: randomSalt,
		passwordDigit: hashPassword,
	};
};

module.exports = hashPassword;
