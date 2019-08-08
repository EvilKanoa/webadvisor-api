class StrictArgHolder {
  constructor(initialArgs = {}) {
    this.args = new Map(this.parseObj(initialArgs));
  }

  parseObj(obj) {
    return Object.keys(obj).map(key => [key, obj[key]]);
  }

  toObj() {
    const obj = Object.create(null);
    for (const [key, value] of this.args.entries()) {
      obj[key] = value;
    }
    return obj;
  }

  get(name, fallback = undefined) {
    return this.args.has(name) ? this.args.get(name) : fallback;
  }

  putArg(name, value) {
    if (this.args.has(name)) {
      return false;
    }

    this.args.set(name, value);
    return true;
  }

  put(obj) {
    const results = Object.create(null);
    for (const [key, value] of this.parseObj(obj)) {
      results[key] = this.putArg(key, value);
    }

    return Object.values(results).includes(false) ? results : undefined;
  }

  contains(name) {
    return this.args.has(name);
  }
}

module.exports = StrictArgHolder;
