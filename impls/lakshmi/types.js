class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }

  equals(anotherValue) {
    return new MalBool(this.value === anotherValue.value);
  }
}

class MalNumber extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalIterables extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(iterable) {
    if (!(iterable instanceof MalIterables)) {
      return new MalBool(false);
    }
    if (this.value.length !== iterable.value.length) {
      return new MalBool(false);
    }

    this.value.forEach((element, index) => {
      if (this.value[index] !== iterable.value[index]) {
        return new MalBool(false);
      }
    });

    return new MalBool(true);
  }
}

class MalList extends MalIterables {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return (
      '(' +
      this.value
        .map((x) => {
          return x instanceof MalValue ? x.pr_str() : x;
        })
        .join(' ') +
      ')'
    );
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalIterables {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return (
      '[' +
      this.value
        .map((x) => {
          if (x instanceof MalValue) {
            return x.pr_str();
          }
          return x;
        })
        .join(' ') +
      ']'
    );
  }
}

class MalBool extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalNil extends MalValue {
  constructor() {
    super(null);
  }

  pr_str() {
    return 'nil';
  }
}

class MalFunction extends MalValue {
  constructor(ast, params, env) {
    super(ast);
    this.params = params;
    this.env = env;
  }

  pr_str() {
    return '#<function>';
  }
}

module.exports = {
  MalValue,
  MalNumber,
  MalSymbol,
  MalIterables,
  MalList,
  MalVector,
  MalBool,
  MalNil,
  MalFunction,
};
