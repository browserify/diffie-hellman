module.exports = generatePrime;

var goodPrimes = {
  256: 'k256',
  224: 'p224',
  192: 'p192',
  25519: 'p25519'
};
function generatePrime(len, crypto) {
  if (len in goodPrimes) {
    return goodPrimes[len];
  } else { 
    return findPrime(len, crypto);
  }
}

// based on find-prime by Kenan Yildirim
// https://github.com/KenanY/find-prime

//and
//bigi https://github.com/cryptocoinjs/bigi
//which is based on jsbn by Tom Wu
//http://www-cs-students.stanford.edu/~tjw/jsbn/
var BN = require('bn.js');
var GCD_30_DELTA = [new BN(6), new BN(4), new BN(2), new BN(4), new BN(2), new BN(4), new BN(6), new BN(2)];


function getMillerRabinTests(bits) {
  if (bits <= 100) return 27;
  if (bits <= 150) return 18;
  if (bits <= 200) return 15;
  if (bits <= 250) return 12;
  if (bits <= 300) return 9;
  if (bits <= 350) return 8;
  if (bits <= 400) return 7;
  if (bits <= 500) return 6;
  if (bits <= 600) return 5;
  if (bits <= 800) return 4;
  if (bits <= 1250) return 3;
  return 2;
}
var lowprimes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
  73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
  157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
  239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
  331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
  421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
  509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
  613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
  709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
  821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
  919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997
];

var lplim = (1 << 26) / lowprimes[lowprimes.length - 1];

// (public) test primality with certainty >= 1-.5^t
function isProbablePrime(n, t) {
  var i, x = n.abs();
  if (x.isEven()) return false;
  i = 1;
  while (i < lowprimes.length) {
    var m = lowprimes[i],
      j = i + 1;
    while (j < lowprimes.length && m < lplim) m *= lowprimes[j++];
    m = x.modn(m);
    while (i < j) if (m % lowprimes[i++] === 0) return false;
  }
  return millerRabin(x, t);
}
function getLowestSetBit(n) {
  var i = -1;
  var len = n.bitLength();
  while (++i < len) {
    if (n.testn(i)) {
      return i;
    }
  }
  return -1;
}
// (protected) true if probably prime (HAC 4.24, Miller-Rabin)
function millerRabin(n, t) {
  var n1 = n.sub(new BN(1));
  var mp = BN.mont(n);
  var k = getLowestSetBit(n1);
  if (k <= 0) return false;
  var r = n1.shrn(k);
  t = (t + 1) >> 1;
  if (t > lowprimes.length) t = lowprimes.length;
  var a;
  var j, bases = []
  for (var i = 0; i < t; ++i) {
    for (;;) {
      j = lowprimes[Math.floor(Math.random() * lowprimes.length)]
      if (bases.indexOf(j) == -1) break;
    }
    bases.push(j);
    a = new BN(j);
    var y = a.toRed(mp).redPow(r).fromRed();
    if (y.cmp(new BN(1)) != 0 && y.cmp(n1) != 0) {
      var j = 1
      while (j++ < k && y.cmp(n1) != 0) {
        y = y.toRed(mp).redPow(new BN(2)).fromRed();
        if (y.cmp(new BN(1)) == 0) return false
      }
      if (y.cmp(n1) != 0) return false
    }
  }
  return true
}
function findPrime(bits, crypto) {

  function generateRandom(bits) {
    var bytes = bits >> 3;
    bytes = bytes || 1;
    var out = new BN(crypto.randomBytes(bits/8));
    while (out.bitLength() > bits) {
      out.ishrn(1);
    }
    return out;
  }
  var num = generateRandom(bits);

  var deltaIdx = 0;

  var mrTests = getMillerRabinTests(num.bitLength());


  while (true) {
    if (num.bitLength() > bits) {
      num = generateRandom(bits);
    }

    if(isProbablePrime(num, mrTests)) {
      return num;
    }

    num.iadd(GCD_30_DELTA[deltaIdx++ % 8]);
  }

}