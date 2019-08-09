const { promisify, filters } = require('../parseUtils');

describe('parseUtils', () => {
  describe('promisify', () => {
    it('binds custom then function to new promise resolve', async () => {
      const test = 'test';
      const mockXray = {
        then: jest.fn(resolve => {
          resolve(test);
          return { catch: jest.fn() };
        }),
        catch: jest.fn(),
      };
      const result = await promisify(mockXray);

      expect(mockXray.then).toHaveBeenCalled();
      expect(result).toBe(test);
    });

    it('binds custom catch function to new promise reject', () => {
      const test = 'test';
      const catchMock = jest.fn(reject => reject(test));
      const mockXray = {
        then: jest.fn(() => ({ catch: catchMock })),
      };

      return promisify(mockXray).catch(e => expect(e).toBe(test));
    });
  });

  describe('filters', () => {
    it('trims strings', () => {
      const mock = jest.fn();

      expect(filters.trim('  test ')).toEqual('test');
      expect(filters.trim(mock)).toBe(mock);
    });

    it('cleans repeated spaces from strings', () => {
      const mock = jest.fn();

      expect(filters.cleanSpaces('test   string is  here')).toEqual(
        'test string is here',
      );
      expect(filters.cleanSpaces(mock)).toBe(mock);
    });

    it('removes newlines from string', () => {
      const mock = jest.fn();

      expect(filters.removeNewlines('test\nstring\n')).toEqual('teststring');
      expect(filters.removeNewlines(mock)).toBe(mock);
    });
  });
});
