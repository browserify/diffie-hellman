var test = require('tape');
var nodeCrypto = require('crypto');
var myCrypto = require('./');

var mods = [
   'modp1', 'modp2', 'modp5', 'modp14', 'modp15', 'modp16', 'modp17', 'modp18'
];

 var lens = [
  64, 65, 128, 384, 512, 1024,
  192, 224, 256];
function run(i) {
	mods.forEach(function (mod) {
		test(mod + ' run ' + i, function (t){
			t.plan(5);
			var dh1 = nodeCrypto.getDiffieHellman(mod);
			var p1 = dh1.getPrime().toString('hex');
			dh1.generateKeys();
			var dh2 = myCrypto.getDiffieHellman(mod);
			t.equals(typeof dh1.setPublicKey, typeof dh2.setPublicKey, 'same methods');
			t.equals(typeof dh1.setPrivateKey, typeof dh2.setPrivateKey, 'same methods');
			var p2 = dh2.getPrime().toString('hex');
			dh2.generateKeys();
			t.equals(p1, p2, 'equal primes');
			var pubk1 = dh1.getPublicKey();
			var pubk2 = dh2.getPublicKey();
			t.notEquals(pubk1.toString('hex'), pubk2.toString('hex'), 'diff public keys');
			var pub1 = dh1.computeSecret(pubk2).toString('hex');
			var pub2 = dh2.computeSecret(pubk1).toString('hex');
			t.equals(pub1, pub2, 'equal secrets');
		});
	});
}


function bylen(t) {
	return function (len){
		t.test('' + len, function (t) {
			t.plan(5);
			var dh2 = myCrypto.createDiffieHellman(len);
			var prime2 = dh2.getPrime();
			var p2 = prime2.toString('hex');
			var dh1 = nodeCrypto.createDiffieHellman(prime2);
			var p1 = dh1.getPrime().toString('hex');
			t.equals(typeof dh1.setPublicKey, typeof dh2.setPublicKey, 'same methods');
			t.equals(typeof dh1.setPrivateKey, typeof dh2.setPrivateKey, 'same methods');
			dh1.generateKeys();
			dh2.generateKeys();
			t.equals(p1, p2, 'equal primes');
			var pubk1 = dh1.getPublicKey();
			var pubk2 = dh2.getPublicKey();
			t.notEquals(pubk1.toString('hex'), pubk2.toString('hex'), 'diff public keys');
			var pub1 = dh1.computeSecret(pubk2).toString('hex');
			var pub2 = dh2.computeSecret(dh1.getPublicKey()).toString('hex');
			t.equals(pub1, pub2, 'equal secrets');
		});
	};
}
function bylen2(t) {
	return function (len){
		t.test('' + len, function (t) {
			t.plan(5);
			var dh2 = nodeCrypto.createDiffieHellman(len);
			var prime2 = dh2.getPrime();
			var p2 = prime2.toString('hex');
			var dh1 = myCrypto.createDiffieHellman(prime2);
			var p1 = dh1.getPrime().toString('hex');
			dh1.generateKeys();
			dh2.generateKeys();
			t.equals(typeof dh1.setPublicKey, typeof dh2.setPublicKey, 'same methods');
			t.equals(typeof dh1.setPrivateKey, typeof dh2.setPrivateKey, 'same methods');
			t.equals(p1, p2, 'equal primes');
			var pubk1 = dh1.getPublicKey();
			var pubk2 = dh2.getPublicKey();
			t.notEquals(pubk1.toString('hex'), pubk2.toString('hex'), 'diff public keys');
			var pub1 = dh1.computeSecret(pubk2).toString('hex');
			var pub2 = dh2.computeSecret(dh1.getPublicKey()).toString('hex');
			t.equals(pub1, pub2, 'equal secrets');
		});
	};
}
if (process.version && process.version.split('.').length === 3 && parseInt(process.version.split('.')[1], 10) > 10) {
	test('create primes', function (t) {
		var f = bylen(t);
		lens.forEach(f);
	});
}
test('create primes other way', function (t) {
		var f = bylen2(t);
		lens.forEach(f);
	});
var i = 0;
while (++i < 2) {
	run(i);
}