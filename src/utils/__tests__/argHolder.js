const StrickArgHolder = require('../argHolder');

describe('StrickArgHolder', () => {
  it('applies initial args', () => {
    const emptyArgHolder = new StrickArgHolder();
    const smallArgHolder = new StrickArgHolder({});
    const largeArgHolder = new StrickArgHolder({
      key1: 'value1',
      key2: { key3: 'value2' },
    });

    expect(emptyArgHolder.args.size).toBe(0);
    expect(smallArgHolder.args.size).toBe(0);
    expect(largeArgHolder.args.size).toBe(2);
    expect(largeArgHolder.args.get('key1')).toEqual('value1');
    expect(largeArgHolder.args.get('key2')).toEqual({ key3: 'value2' });
  });

  it('generates object of args', () => {
    const testObj = { key1: 'value1', key2: { key3: 'value2' } };
    const argHolder = new StrickArgHolder(testObj);

    expect(argHolder.toObj()).toEqual(testObj);
    expect(argHolder.toObj()).not.toBe(testObj);
  });

  it('retrieves args without fallback', () => {
    const testValue = 'value1';
    const argHolder = new StrickArgHolder({ key1: testValue });

    expect(argHolder.get('key1')).toBe(testValue);
    expect(argHolder.get('key2')).toBeUndefined();
  });

  it('retrieves args with fallback', () => {
    const testValue = 'value1';
    const testFallback = 'fallback';
    const argHolder = new StrickArgHolder({ key1: testValue });

    expect(argHolder.get('key1', testFallback)).toBe(testValue);
    expect(argHolder.get('key2', testFallback)).toBe(testFallback);
  });

  it('inserts new args into holder', () => {
    const testValue = 'value1';
    const argHolder = new StrickArgHolder({ key2: 'value2' });
    const putResult = argHolder.putArg('key1', testValue);

    expect(putResult).toBeTruthy();
    expect(argHolder.args.get('key1')).toBe(testValue);
  });

  it('does not insert preexisting args', () => {
    const testValue1 = 'value1';
    const testValue2 = 'value2';
    const argHolder = new StrickArgHolder({ key1: testValue1 });
    const putResult = argHolder.putArg('key1', testValue2);

    expect(putResult).toBeFalsy();
    expect(argHolder.args.get('key1')).toBe(testValue1);
  });

  it('inserts multiple new args some being new', () => {
    const testValue1 = 'value1';
    const testValue2 = 'value2';
    const testValue3 = 'value3';
    const argHolder = new StrickArgHolder({ key1: testValue1 });
    const putResult1 = argHolder.put({ key1: testValue2, key2: testValue3 });
    const putResult2 = argHolder.put({ newKey: false });

    expect(putResult1).toEqual({ key1: false, key2: true });
    expect(argHolder.args.get('key1')).toBe(testValue1);
    expect(argHolder.args.get('key2')).toBe(testValue3);
    expect(putResult2).toBeUndefined();
    expect(argHolder.args.get('newKey')).toBe(false);
  });

  it('checks if args are present', () => {
    const testValue = 'value1';
    const argHolder = new StrickArgHolder({ key1: testValue });

    expect(argHolder.contains('key1')).toBeTruthy();
    expect(argHolder.contains('key2')).toBeFalsy();
  });
});
