const DF = require("diffie-hellman");

class DiffieHellman {
	constructor(group) {
		const server = DF.getDiffieHellman(group);
		server.generateKeys();
	}

	getPublicKey() {
		return server.getPublicKey().toString("base64");
	}

	generateSecretKey(base64PublicKey) {
		const buffer = Buffer.from(base64PublicKey, "base64");
		return server.computeSecret(buffer);
	}
}

module.exports = new DiffieHellman("modp1");
