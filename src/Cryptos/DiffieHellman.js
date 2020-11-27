const DF = require("diffie-hellman");

class DiffieHellman {
	constructor(group) {
		this.server = DF.getDiffieHellman(group);
		this.server.generateKeys();
	}

	getPrime() {
		//chuyên thành base64
		const prime = this.server.getPrime().toString("base64");
		return prime;
	}

	getGenerator() {
		//chuyên thành base64
		const generator = this.server.getGenerator().toString("base64");
		return generator;
	}

	getPublicKey() {
		//chuyên thành base64
		const publicKey = this.server.getPublicKey().toString("base64");
		return publicKey;
	}

	getPrivateKey() {
		//chuyên thành basee64
		const privateKey = this.server.getPrivateKey().toString("base64");
		return privateKey;
	}

	generateSecretKey(publicKey) {
		//chuyển base thành buffer
		const buffer = Buffer.from(publicKey, "base64");
		return this.server.computeSecret(buffer).toString("base64");
	}
}

module.exports = {Server: new DiffieHellman("modp1")};
