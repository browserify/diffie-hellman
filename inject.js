var primes = require('./primes.json');
var DH = require('./dh');
var generatePrime = require('./generatePrime');
module.exports = function (crypto, exports) {
	exports.getDiffieHellman = function (mod) {
		return new DH(new Buffer(primes[mod].prime, 'hex'), crypto);
	};
	exports.createDiffieHellman = function (prime, enc) {
		if (typeof prime === 'number') {
			return new DH(generatePrime(prime, crypto), crypto);
		}
		enc = enc || 'utf8';
		if (!Buffer.isBuffer(prime)) {
			prime = new Buffer(prime, enc);
		}
		return new DH(prime, crypto);
	};
};