var test = require('tape');
var nodeCrypto = require('crypto');
var myCrypto = require('./');

var mods = [
   'modp1', 'modp2', 'modp5', 'modp14', 'modp15', 'modp16'/*, 'modp17', 'modp18'*/
];

function run(i) {
	mods.forEach(function (mod) {
		test(mod + ' run ' + i, function (t){
			t.plan(2);
			var dh1 = nodeCrypto.getDiffieHellman(mod);
			var p1 = dh1.getPrime().toString('hex');
			dh1.generateKeys();
			var dh2 = myCrypto.getDiffieHellman(mod);
			var p2 = dh2.getPrime().toString('hex');
			dh2.generateKeys();
			t.equals(p1, p2, 'equal primes')
			var pub1 = dh1.computeSecret(dh2.getPublicKey()).toString('hex');
			var pub2 = dh2.computeSecret(dh1.getPublicKey()).toString('hex');
			t.equals(pub1, pub2, 'equal secrets');
		});
	});
}
var i = 0;
while (++i < 3) {
	run(i);
}