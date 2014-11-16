
module.exports = findPrime;
findPrime.simpleSieve = simpleSieve;
findPrime.fermatTest = fermatTest;
var BN = require('bn.js');
var TWENTYFOUR = new BN(24);
var MillerRabin = require('miller-rabin');
var millerRabin = new MillerRabin();
var ONE = new BN(1);
var TWO = new BN(2);
var ELEVEN = new BN(11);
var FOUR = new BN(4);
var TWELVE = new BN(12);
var primes = null;

function _getPrimes() {
  if (primes !== null)
    return primes;

  var limit = 0x100000;
  var res = [];
  res[0] = 2;
  for (var i = 1, k = 3; k < limit; k += 2) {
    var sqrt = Math.ceil(Math.sqrt(k));
    for (var j = 0; j < i && res[j] <= sqrt; j++)
      if (k % res[j] === 0)
        break;

    if (i !== j && res[j] <= sqrt)
      continue;

    res[i++] = k;
  }
  primes = res;
  return res;
}
function simpleSieve(p) {
  var primes = _getPrimes();

  for (var i = 0; i < primes.length; i++)
    if (p.modn(primes[i]) === 0)
      return false;

  return true;
}
function fermatTest(p) {
  var red = BN.mont(p);
  return TWO.toRed(red).redPow(p.subn(1)).fromRed().cmpn(1) === 0;
}
function findPrime(bits, crypto) {

  function generateRandom(bits) {
    var r = crypto.randomBytes(Math.ceil(bits / 8));
    r[0] |= 0xc0;
    r[r.length - 1] |= 3;

    var out = new BN(r);
    while (out.mod(TWENTYFOUR).cmp(ELEVEN)) {
      out.iadd(FOUR);
    }
    return out;
  }
  var num = generateRandom(bits);


  var runs = 0;
  var n2 = num.shrn(1);
  while (true) {
    runs++;
    if (num.bitLength() > bits) {
      num = generateRandom(bits);
      n2 = num.shrn(1);
    }
    if (!simpleSieve(n2)) {
      num.iadd(TWENTYFOUR);
      n2.iadd(TWELVE);
      continue;
    }
    if (!fermatTest(n2)) {
      num.iadd(TWENTYFOUR);
      n2.iadd(TWELVE);
      continue;
    }
    if (!millerRabin.test(n2)) {
      num.iadd(TWENTYFOUR);
      n2.iadd(TWELVE);
      continue;
    }
    if (!simpleSieve(num)) {
      num.iadd(TWENTYFOUR);
      n2.iadd(TWELVE);
      continue;
    }
    if (!fermatTest(num)) {
      num.iadd(TWENTYFOUR);
      n2.iadd(TWELVE);
      continue;
    }
    if (millerRabin.test(num)) {
      return num;
    }
    num.iadd(TWENTYFOUR);
    n2.iadd(TWELVE);
  }

}