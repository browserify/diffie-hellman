var BN = require('bn.js');
var primes = require('./primes.json');
Object.keys(primes).forEach(function (mod){
	BN.primes[mod] = new BN.MPrime(mod, new BN(new Buffer(primes[mod].prime, 'hex')));
});
module.exports = DH;

function DH(prime, crypto) {
	this.setGenerator(new Buffer([2]));
	this.__prime = BN._prime(prime);
	this._prime = BN.red(this.__prime);
	this._pub = void 0;
	this._priv = void 0;
	this._makeNum = function makeNum() {
		return crypto.randomBytes(192);
	};
}
DH.prototype.generateKeys = function () {
	this.setPrivateKey(this._makeNum());
	this._pub = this._gen.toRed(this._prime).redPow(this._priv).fromRed();
	return this.getPublicKey();
};

DH.prototype.computeSecret = function (other) {
	other = new BN(other);
	other = other.toRed(this._prime);
	var secret = other.redPow(this._priv).fromRed();
	return new Buffer(secret.toArray());
}
DH.prototype.getPublicKey = function (enc) {
	return returnValue(this._pub, enc);
};
DH.prototype.getPrivateKey = function (enc) {
	return returnValue(this._priv, enc);
};

DH.prototype.getPrime = function (enc) {
	return returnValue(this.__prime.p, enc);
};
DH.prototype.getGenerator = function (enc) {
	return returnValue(this._gen, enc);
};
DH.prototype.setGenerator = function (gen, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(gen)) {
		gen = new Buffer(gen, enc);
	}
	this._gen = new BN(gen);
}
DH.prototype.setPublicKey = function (pub, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(pub)) {
		pub = new Buffer(pub, enc);
	}
	this._pub = new BN(pub);
}
DH.prototype.setPrivateKey = function (priv, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(priv)) {
		priv = new Buffer(priv, enc);
	}
	this._priv = new BN(priv);
}
function returnValue(bn, enc) {
	var buf = new Buffer(bn.toArray());
	if (!enc) {
		return buf;
	} else {
		return buf.toString(enc);
	}
}