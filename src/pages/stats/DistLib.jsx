// Library of Random Distributions


// Uniform Distribution (Integer Rounding)
const getUnif = (min, max) => {
    let r = Math.random();
    let rv = Math.round(r * (max - min) + min);
    return rv;
};


// Normal Distribution (Integer Rounding)
function getNorm(mean=0, stdev=1) {
    console.log(mean,stdev,"LLL")
    const u = 1 - Math.random(); // Converting [0,1) to (0,1]
    const v = Math.random();
    const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
    // Transform to the desired mean and standard deviation:
    return Math.round(z * stdev + mean);
}

// Poisson Distribution
const getPois = (lambda) => {
    let L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do {
      k++;
      p *= Math.random();
    } while (p > L);
    return k - 1;
};
  
// Log Norm Distribution (Integer Rounding)
const getLogNorm = (mean = 0, stdDev = 1) => {
    const normRand = getNorm(mean, stdDev); // You can use the Box-Muller transform from the previous example
    return Math.round(Math.exp(normRand));
};
  
// Binomial Distribution
const getBin = (n, p) => {
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (Math.random() < p) count++;
    }
    return count;
};
  
// Exponential Distribution (Integer Rounding)
const getExp = (lambda) => {
    return Math.round(-Math.log(1 - Math.random()) / lambda);
};
  


export const DIST = {
    UNIF: getUnif,
    NORM: getNorm,
    POIS: getPois,
    LOG_NORM: getLogNorm,
    BIN: getBin,
    EXP: getExp,
}
