const { promisify } = require('../parseUtils');

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
});
