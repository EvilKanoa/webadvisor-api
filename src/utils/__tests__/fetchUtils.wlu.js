const { toWLUTerm, computeWLUTimestamp } = require('../fetchUtils.wlu');

describe('WLU Fetch Utils', () => {
  describe('toWLUTerm', () => {
    it.each([
      ['W19', '201901'],
      ['F19', '201909'],
      ['S19', '201905'],
      ['w00', '200001'],
      ['XXX', '201901'],
      ['', '201901'],
      ['2015', '201901'],
    ])('converts %s to %s correctly', (term, expected) => {
      expect(toWLUTerm(term)).toEqual(expected);
    });
  });

  describe('computeWLUTimestamp', () => {
    it('matches WLU timestamp values', () => {
      const t1 = computeWLUTimestamp(1546318800000);
      const t2 = computeWLUTimestamp(1430798400000);

      expect(t1).toEqual({ t: 980, e: 39 });
      expect(t2).toEqual({ t: 640, e: 13 });
    });

    it('uses the current date as a default', () => {
      const t1 = computeWLUTimestamp(new Date());
      const t2 = computeWLUTimestamp();

      expect(t1).toEqual(t2);
    });
  });
});
