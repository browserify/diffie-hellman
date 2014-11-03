var test = require('tape');
var nodeCrypto = require('crypto');
var myCrypto = require('./');

var mods = [
   'modp1', 'modp2', 'modp5', 'modp14', 'modp15', 'modp16'/*, 'modp17', 'modp18'*/
];

function run(i) {
	test('run ' + i, function (t) {
		console.time('test' + i);
		mods.forEach(function (mod) {
			t.test(mod + ' run ' + i, function (t){
				t.plan(2);
				var dh1 = nodeCrypto.getDiffieHellman(mod);
				var p1 = dh1.getPrime().toString('hex');
				dh1.generateKeys();
				var dh2 = myCrypto.getDiffieHellman(mod);
				var p2 = dh2.getPrime().toString('hex');
				dh2.generateKeys();
				t.equals(p1, p2, 'equal primes');
				var pub1 = dh1.computeSecret(dh2.getPublicKey()).toString('hex');
				var pub2 = dh2.computeSecret(dh1.getPublicKey()).toString('hex');
				t.equals(pub1, pub2, 'equal secrets');
			});
		});
		t.test('end', function (t){
			console.timeEnd('test' + i);
	 	t.end();
	 });
	});
}
run(1);
run(2);
