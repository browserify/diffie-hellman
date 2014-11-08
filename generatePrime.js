
module.exports = findPrime;

var BN = require('bn.js');
var TWENTYFOUR = new BN(24);
var MillerRabin = require('miller-rabin');
var millerRabin = new MillerRabin();
var ONE = new BN(1);
var TWO = new BN(2);
var ELEVEN = new BN(11);
var FOUR = new BN(4);
function findPrime(bits, crypto) {

  function generateRandom(bits) {
    var bytes = bits >> 3;
    bytes = bytes || 1;
    var out = new BN(crypto.randomBytes(bytes));
    while (out.bitLength() > bits) {
      out.ishrn(1);
    }
    if (out.isEven()) {
      out.iadd(ONE);
    }
    if (!out.testn(1)) {
      out.iadd(TWO);
    }
    while (out.mod(TWENTYFOUR).cmp(ELEVEN)) {
      out.iadd(FOUR);
    }
    return out;
  }
  var num = generateRandom(bits);


  var runs = 0;

  while (true) {
    runs++;
    if (num.bitLength() > bits) {
      num = generateRandom(bits);
    }
    if(millerRabin.test(num) && millerRabin.test(num.shrn(1))) {
      console.log('found in', runs);
      return num;
    }

    num.iadd(TWENTYFOUR);
  }

}