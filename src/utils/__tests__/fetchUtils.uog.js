const { sendRequest, getCookie } = require('../fetchUtils.uog');

describe('UoG Fetch Utils', () => {
  describe('getCookie', () => {
    const emptyCookie = 'COOKIE_KEY_1=';
    const fullCookie = 'COOKIE_KEY_2=COOKIE_VALUE';

    it('returns undefined when no cookies present', () => {
      const res1 = { headers: {} };
      const res2 = { headers: { 'set-cookie': [] } };

      expect(getCookie(res1, 'leet')).not.toBeDefined();
      expect(getCookie(res2, 'leet')).not.toBeDefined();
    });

    it('returns an empty string when cookie has no value', () => {
      const res = { headers: { 'set-cookie': [emptyCookie] } };

      expect(getCookie(res, 'COOKIE_KEY_1')).toEqual('');
    });

    it('returns undefined when no cookie found', () => {
      const res = { headers: { 'set-cookie': [emptyCookie] } };

      expect(getCookie(res, 'COOKIE_KEY_2')).not.toBeDefined();
    });

    it('returns the value of a cookie if the cookie is present', () => {
      const res = { headers: { 'set-cookie': [fullCookie] } };

      expect(getCookie(res, 'COOKIE_KEY_2')).toEqual('COOKIE_VALUE');
      expect(getCookie(res, 'cookie_key_2')).toEqual('COOKIE_VALUE');
      expect(getCookie(res, 'cOOkIe_keY_2')).toEqual('COOKIE_VALUE');
    });

    it('returns the correct cookie value when multiple cookies present', () => {
      const res = { headers: { 'set-cookie': [emptyCookie, fullCookie] } };

      expect(getCookie(res, 'COOKIE_KEY_1')).toEqual('');
      expect(getCookie(res, 'COOKIE_KEY_2')).toEqual('COOKIE_VALUE');
      expect(getCookie(res, 'COOKIE_KEY_3')).not.toBeDefined();
    });
  });
});
