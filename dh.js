var BN = require('bn.js');

module.exports = DH;

function DH(prime, crypto) {
	this.setGenerator(new Buffer([2]));
	this.__prime = new BN(prime.toString('hex'), 16);
	this._prime = BN.mont(this.__prime);
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
	other = new BN(other.toString('hex'), 16);
	other = other.toRed(this._prime);
	var secret = other.redPow(this._priv).fromRed();
	return new Buffer(secret.toString('hex'), 'hex');
}
DH.prototype.getPublicKey = function () {
	return returnValue(this._pub, enc);
};
DH.prototype.getPrivateKey = function () {
	return returnValue(this._priv, enc);
};

DH.prototype.getPrime = function (enc) {
	return returnValue(this.__prime, enc);
};
DH.prototype.getGenerator = function (enc) {
	return returnValue(this._gen, enc);
};
DH.prototype.setGenerator = function (gen, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(gen)) {
		gen = new Buffer(gen, enc);
	}
	this._gen = new BH(gen.toString('hex'), 16);
}
DH.prototype.setPublicKey = function (pub, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(pub)) {
		pub = new Buffer(pub, enc);
	}
	this._pub = new BH(pub.toString('hex'), 16);
}
DH.prototype.setPrivateKey = function (priv, enc) {
	enc = enc || 'utf8';
	if (!Buffer.isBuffer(priv)) {
		priv = new Buffer(priv, enc);
	}
	this._priv = new BH(priv.toString('hex'), 16);
}
function returnValue(bn, enc) {
	var hex = bn.toString(16);
	if (enc === 'hex') {
		return hex;
	}
	var buf = new Buffer(hex, 'hex');
	if (!enc) {
		return buf;
	} else {
		return buf.toString(end);
	}
}