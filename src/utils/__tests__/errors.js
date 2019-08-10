const errors = require('../errors');

describe('errors.js', () => {
  describe('catchResolverErrors', () => {
    beforeEach(() => {
      console.error = jest.fn();
      jest.resetModules();
    });

    it('executes passed function', async () => {
      const mock = jest.fn();
      await errors().catchResolverErrors(mock);

      expect(mock).toHaveBeenCalled();
    });

    it('returns resolved result of passed function', async () => {
      const mockResult = 'test';
      const mock = jest.fn().mockResolvedValue(mockResult);
      const result = await errors().catchResolverErrors(mock);

      expect(result).toBe(mockResult);
    });

    it('logs a thrown error to stderr', async () => {
      const mockError = Error('test');
      const mock = () => {
        throw mockError;
      };

      await expect(errors().catchResolverErrors(mock)).rejects.toBeDefined();
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it('throws originally thrown error in dev mode', async () => {
      const mockError = 'test';
      const mock = () => {
        throw mockError;
      };

      await expect(
        errors('development').catchResolverErrors(mock),
      ).rejects.toBe(mockError);
    });

    it('throws obscured error in prod mode', async () => {
      const mock = () => {
        throw 'test';
      };

      await expect(
        errors('production').catchResolverErrors(mock),
      ).rejects.toThrowError('Internal resolve error encountered');
    });
  });

  describe('catchResolverErrorsSync', () => {
    beforeEach(() => {
      console.error = jest.fn();
      jest.resetModules();
    });

    it('executes passed function', () => {
      const mock = jest.fn();
      errors().catchResolverErrorsSync(mock);

      expect(mock).toHaveBeenCalled();
    });

    it('returns result of passed function', () => {
      const mockResult = 'test';
      const mock = jest.fn().mockReturnValue(mockResult);
      const result = errors().catchResolverErrorsSync(mock);

      expect(result).toBe(mockResult);
    });

    it('logs a thrown error to stderr', () => {
      const mockError = Error('test');
      const mock = () => {
        throw mockError;
      };

      expect(() => {
        errors().catchResolverErrorsSync(mock);
      }).toThrow();
      expect(console.error).toHaveBeenCalledWith(mockError);
    });

    it('throws originally thrown error in dev mode', () => {
      const mockError = 'test';
      const mock = () => {
        throw mockError;
      };

      expect(() => {
        errors('development').catchResolverErrorsSync(mock);
      }).toThrowError(mockError);
    });

    it('throws obscured error in prod mode', () => {
      const mock = () => {
        throw 'test';
      };

      expect(() => {
        errors('production').catchResolverErrorsSync(mock);
      }).toThrowError('Internal resolve error encountered');
    });
  });
});
