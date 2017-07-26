var _; //globals

describe("About Applying What We Have Learnt", function() {

  var products;

  beforeEach(function () { 
    products = [
       { name: "Sonoma", ingredients: ["artichoke", "sundried tomatoes", "mushrooms"], containsNuts: false },
       { name: "Pizza Primavera", ingredients: ["roma", "sundried tomatoes", "goats cheese", "rosemary"], containsNuts: false },
       { name: "South Of The Border", ingredients: ["black beans", "jalapenos", "mushrooms"], containsNuts: false },
       { name: "Blue Moon", ingredients: ["blue cheese", "garlic", "walnuts"], containsNuts: true },
       { name: "Taste Of Athens", ingredients: ["spinach", "kalamata olives", "sesame seeds"], containsNuts: true }
    ];
  });

  /*********************************************************************************/

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (imperative)", function () {

    var i,j,hasMushrooms, productsICanEat = [];

    for (i = 0; i < products.length; i+=1) {
        if (products[i].containsNuts === false) {
            hasMushrooms = false;
            for (j = 0; j < products[i].ingredients.length; j+=1) {
               if (products[i].ingredients[j] === "mushrooms") {
                  hasMushrooms = true;
               }
            }
            if (!hasMushrooms) productsICanEat.push(products[i]);
        }
    }

    expect(productsICanEat.length).toBe(1);
  });

  it("given I'm allergic to nuts and hate mushrooms, it should find a pizza I can eat (functional)", function () {

      var productsICanEat = _(products).chain()
          .filter(function(product) { return !product.containsNuts; })
          .filter(function(product) {
            return !_(product.ingredients).any(function(ingredient) { return ingredient === "mushrooms"; });
          }).value();

      expect(productsICanEat.length).toBe(1);
  });

  /*********************************************************************************/

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (imperative)", function () {
    
    var sum = 0;
    for(var i=1; i<1000; i+=1) {
      if (i % 3 === 0 || i % 5 === 0) {
        sum += i;
      }
    }
    
    expect(sum).toBe(233168);
  });

  it("should add all the natural numbers below 1000 that are multiples of 3 or 5 (functional)", function () {
    //not happy about this.  Wanted to use range(0, 1000, 3) and range(0, 1000, 5) but this version of _ doesn't have union
    var sum = _(_.range(0, 1000, 1)).chain()
        .filter(function(i) { return i % 3 === 0 || i % 5 === 0 })
        .reduce(function(total, x) { return total + x })
        .value();

    expect(233168).toBe(sum);
  });

  /*********************************************************************************/
   it("should count the ingredient occurrence (imperative)", function () {
    var ingredientCount = { "{ingredient name}": 0 };

    for (i = 0; i < products.length; i+=1) {
        for (j = 0; j < products[i].ingredients.length; j+=1) {
            ingredientCount[products[i].ingredients[j]] = (ingredientCount[products[i].ingredients[j]] || 0) + 1;
        }
    }

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should count the ingredient occurrence (functional)", function () {
    var initial = { "{ingredient name}": 0 };

    var ingredientCount = _(products).chain()
        .map(function(product) { return product.ingredients })
        .flatten()
        .reduce(function(counts, ingredient) {
            counts[ingredient] = (counts[ingredient] || 0) + 1;
            return counts;
        }, initial)
        .value();

    expect(ingredientCount['mushrooms']).toBe(2);
  });

  it("should find the largest prime factor of a composite number", function () {
    var largestPrimeFactorOf = function(value) {
      return _(_.range(2, value + 1)).chain()
          .reduce(function(primes, candidate) {
            if (!_(primes).any(function(prime) { return candidate % prime === 0})) {
              primes.push(candidate);
            }
            return primes;
          }, [])
          .filter(function(prime) { return value % prime === 0})
          .last()
          .value();
    };

    expect(largestPrimeFactorOf(15)).toBe(5);
    expect(largestPrimeFactorOf(225)).toBe(5);
    expect(largestPrimeFactorOf(3 * 3 * 7 * 11 * 17)).toBe(17);
    expect(largestPrimeFactorOf(53 * 81)).toBe(53);
  });

  it("should find the largest palindrome made from the product of two 3 digit numbers", function () {
    var reverse = function(string) {
      return string.split("").reverse().join("");
    }

    var longestPalindrome = _(_.range(100, 1000)).chain()
        .map(function(x) {
            return _(_.range(x, 1000)).map(function(y) { return x * y });
        }).flatten()
        .map(function(x) { return x.toString() })
        .filter(function(x) { return x === reverse(x)})
        .reduce(function(current, x) { return current.length < x.length ? x : current}, "")
        .value();

    expect(longestPalindrome.length).toBe(6);
    expect(longestPalindrome === reverse(longestPalindrome)).toBeTruthy();
  });

  it("should find the smallest number divisible by each of the numbers 1 to 20", function () {
    var gcd = function(a, b) {
      var q = Math.max(a, b);
      var r = Math.min(a, b);
      while (r !== 0) {
        var remainder = q % r;
        q = r;
        r = remainder;
      }
      return q;
    };
    
    var lcm = function(values) {
      return _(values).reduce(function(lcm, value) { return (lcm * value) / gcd(lcm, value)}, 1);
    };

    expect(lcm([1, 2, 3, 4, 5])).toBe(60);
    expect(lcm(_.range(1, 21))).toBe(232792560);
  });

  it("should find the difference between the sum of the squares and the square of the sums", function () {


    var findDifference = function(values) {
      var sumAndSquareSum = _(values).reduce(function(container, value) {
              container.sum += value;
              container.squareSum += value * value;
              return container;
          }, {sum: 0, squareSum: 0});
      return sumAndSquareSum.sum * sumAndSquareSum.sum - sumAndSquareSum.squareSum;
    }

    expect(findDifference([1, 2, 3, 4, 5])).toBe(15 * 15 - (1 + 4 + 9 + 16 + 25));
  });

  it("should find the 10001st prime", function () {
    //use two-tier primality testing with a sieve in between to take advantage of system resources appropriately

    var largestPossibleNthPrime = function(n) {
      return n * (Math.log(n) + Math.log(Math.log(n)));
    }

    var sieve = function(remainingCandidates) {
      var nextPrime = _(remainingCandidates).first();
      return _(remainingCandidates).filter(function(x) { return x % nextPrime !== 0});
    }

    var isPrime = function(candidate, primes) {
      return !_(primes).any(function(prime) { return candidate % prime === 0});
    }

    var collectIfPrime = function(candidate, primes) {
      if (isPrime(candidate, primes)) {
        primes.push(candidate);
      }
    }

    var computeNPrimes = function(n) {
      var primes = [2];
      var candidate = 3;
      while (primes.length < n) {
        collectIfPrime(candidate, primes);
        candidate += 2;
      }
      return primes;
    }

    var computeRemainingPrimes = function(n, primes) {
      var candidates = _(_.range(2, largestPossibleNthPrime(n) + 1))
          .filter(function(candidate) { return isPrime(candidate, primes) });

      for (var i = 0; i < candidates.length; i++) {
        var candidate = candidates[i];
        collectIfPrime(candidate, primes);
      }
    }

    var computeNthPrime = function(n) {
      if (n < 1) return undefined;
      if (n === 1) return 2;
      var primes = computeNPrimes(Math.floor(Math.sqrt(n)));
      computeRemainingPrimes(n, primes);
      return primes[n - 1];
    }

    expect(computeNthPrime(5)).toBe(11);
    expect(computeNthPrime(10001)).toBe(104743);
  });
});
