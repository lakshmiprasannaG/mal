const { MalList } = require('./types');

class Env {
  #outer;
  constructor(outer, binds, exprs) {
    this.#outer = outer;
    this.data = {};
    this.binds = binds;
    this.exprs = exprs;
    this.#initialize();
  }

  #initialize() {
    if (this.binds instanceof MalList && this.exprs instanceof MalList) {
      console.log('init => ', this.binds, this.exprs);
      for (let index = 0; index < this.binds.length(); index++) {
        const symbol = this.binds.value[index];
        const value = this.exprs.value[index];
        this.set(symbol, value);
      }
    }
  }

  set(symbol, value) {
    this.data[symbol.value] = value;
  }

  find(symbol) {
    if (this.data[symbol.value] !== undefined) {
      return this;
    }

    if (this.#outer != undefined) {
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
