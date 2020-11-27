const DF = require("diffie-hellman");

class DiffieHellman {
	constructor(group) {
		this.server = DF.getDiffieHellman(group);
		this.server.generateKeys();
	}

	getPrime() {
		const prime = this.server.getPrime().toString("base64");
		return prime;
	}

	getGenerator() {
		const generator = this.server.getGenerator().toString("base64");
		return generator;
	}

	getPublicKey() {
		const publicKey = this.server.getPublicKey().toString("base64");
		return publicKey;
	}

	getPrivateKey() {
		const privateKey = this.server.getPrivateKey().toString("base64");
		return privateKey;
	}

	generateSecretKey(publicKey) {
		const buffer = Buffer.from(publicKey, "base64");
		return this.server.computeSecret(buffer).toString("base64");
	}
}

module.exports = {Server: new DiffieHellman("modp1")};
