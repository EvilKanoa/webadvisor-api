const { uog } = require('../../constants');
const { sendRequest, getCookie, toCalendarYear } = require('../fetchUtils.uog');

describe('fetchUtils.uog', () => {
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

  describe('sendRequest', () => {
    let requestMock;
    const result = '<html></html>';
    const tokens = ['TOKEN1', 'TOKEN2'];
    const cookies = tokens.map(token => `LASTTOKEN=${token}`);

    beforeEach(() => {
      requestMock = jest.fn();
      requestMock
        .mockReturnValueOnce(
          Promise.resolve({ headers: { 'set-cookie': [cookies[0]] } }),
        )
        .mockReturnValueOnce(
          Promise.resolve({ headers: { 'set-cookie': [cookies[1]] } }),
        );

      requestMock.post = jest.fn();
      requestMock.post.mockReturnValueOnce(Promise.resolve(result));
    });

    it('sends two gets and then a post request', async () => {
      const response = await sendRequest(requestMock);

      expect(requestMock.mock.calls.length).toBe(2);
      expect(requestMock.mock.calls[0].length).toBe(1);
      expect(requestMock.mock.calls[0][0]).toEqual({
        url: uog.webadvisorTokenUrl,
        resolveWithFullResponse: true,
      });

      expect(requestMock.mock.calls[1].length).toBe(1);
      expect(requestMock.mock.calls[1][0]).toEqual({
        url: uog.webadvisorTokenUrl + tokens[0],
        resolveWithFullResponse: true,
      });

      expect(requestMock.post.mock.calls.length).toBe(1);
      expect(requestMock.post.mock.calls[0].length).toBe(1);
      expect(requestMock.post.mock.calls[0][0]).toEqual({
        url: uog.webadvisorCourseUrl + tokens[1],
        form: uog.webadvisorCourseSearchData,
      });

      expect(response).toBe(result);
    });

    it('inserts additional form data into the post request', async () => {
      const formData = { var1: 'test_var1', var2: 'test_var2' };
      const response = await sendRequest(requestMock, formData);

      expect(requestMock.post.mock.calls[0][0]).toEqual({
        url: uog.webadvisorCourseUrl + tokens[1],
        form: { ...uog.webadvisorCourseSearchData, ...formData },
      });
      expect(response).toBe(result);
    });

    it('inserts post options correctly', async () => {
      const postOpts = { myOpt: 1, otherOpt: 'hello' };
      const response = await sendRequest(requestMock, null, postOpts);

      expect(requestMock.post.mock.calls[0][0]).toEqual({
        ...postOpts,
        url: uog.webadvisorCourseUrl + tokens[1],
        form: uog.webadvisorCourseSearchData,
      });
      expect(response).toBe(result);
    });

    it('passes exceptions upwards correctly', () => {
      const myError = new Error('my error');
      const badRequestMock = jest.fn(async () => {
        throw myError;
      });

      return expect(sendRequest(badRequestMock)).rejects.toThrow(myError);
    });
  });

  describe('toCalendarYear', () => {
    it('defaults to current when year is undefined', () => {
      expect(toCalendarYear(undefined)).toEqual('current');
      expect(toCalendarYear(null)).toEqual('current');
      expect(toCalendarYear()).toEqual('current');
    });
    it('defaults to current when year is not positive', () => {
      expect(toCalendarYear(-1)).toEqual('current');
      expect(toCalendarYear('-1')).toEqual('current');
      expect(toCalendarYear(0)).toEqual('current');
    });

    it('falls back to current when year is not a number', () => {
      expect(toCalendarYear('not a number')).toEqual('current');
      expect(toCalendarYear(NaN)).toEqual('current');
      expect(toCalendarYear({})).toEqual('current');
      expect(toCalendarYear(true)).toEqual('current');
    });

    it('creates year range for a valid year', () => {
      expect(toCalendarYear(2020)).toEqual('2020-2021');
      expect(toCalendarYear('2020')).toEqual('2020-2021');
      expect(toCalendarYear(1)).toEqual('1-2');
    });
  });
});
