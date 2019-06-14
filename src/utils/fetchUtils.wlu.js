const { wlu } = require('../constants');

module.exports = {
  toWLUTerm: term =>
    `20${term.slice(1)}${wlu.seasons[term.slice(0, 1)] || '01'}`,

  computeWLUTimestamp: (date = new Date()) => {
    // This is simply black magic.
    // Original Source (https://scheduleme.wlu.ca/):
    //   function nWindow() {
    //     var f8b0=["\x26\x74\x3D","\x26\x65\x3D"]
    //     var t=(Math.floor((new Date())/60000))%1000;
    //     var e=t%3+t%29+t%42;
    //     return f8b0[0]+t+f8b0[1]+e;
    //   }
    const t = Math.floor(date / 60000) % 1000;
    const e = (t % 3) + (t % 29) + (t % 42);
    return { t, e };
  },
};
