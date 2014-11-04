var primes = require('./primes.json');
var DH = require('./dh');
module.exports = function (crypto, exports) {
	exports.getDiffieHellman = function (mod) {
		if (mod === 'modp17' || mod === 'modp18') {
			throw new Error(mod + ' is not implimented');
		}
		return new DH(new Buffer(primes[mod].prime, 'hex'), crypto);
	};
	exports.createDiffieHellman = function (prime, enc) {
		if (typeof prime === 'number') {
			throw new Error('generating primes not implimented');
		}
		enc = enc || 'utf8';
		if (!Buffer.isBuffer(prime)) {
			prime = new Buffer(prime, enc);
		}
		return new DH(prime, crypto);
	};
};