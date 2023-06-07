const { MalList } = require('./types');

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
    for (let index = 0; index < this.binds.length; index++) {
      const symbol = this.binds[index];
      if (symbol.value === '&') {
        this.set(this.binds[index + 1], new MalList(this.exprs.slice(index)));
        return;
      }

      const value = this.exprs[index];
      this.set(symbol, value);
    }
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
