class Env {
  #outer;
  constructor(outer, binds = [], exprs = []) {
    this.#outer = outer;
    this.data = {};
    this.binds = binds;
    this.exprs = exprs;
    this.#init();
  }

  #init() {
    this.binds.forEach((symbol, index) => {
      const value = exprs[index];
      this.set(symbol, value);
    });
  }

  set(symbol, value) {
    this.data[symbol.value] = value;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }

    if (this.#outer !== undefined) {
      return this.#outer.find(symbol);
    }
  }

  get(symbol) {
    const env = this.find(symbol);
    if (!env) {
      throw `${symbol.value} not found`;
    }

    return env.data[symbol.value];
  }
}

module.exports = { Env };
