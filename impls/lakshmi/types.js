class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }

  equals(anotherValue) {
    return this.value === anotherValue.value;
  }

  count() {
    return 1;
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

class MalIterable extends MalValue {
  constructor(value) {
    super(value);
  }

  equals(iterable) {
    if (!(iterable instanceof MalIterable)) {
      return false;
    }
    if (this.value.length !== iterable.value.length) {
      return false;
    }

    this.value.forEach((element, index) => {
      if (this.value[index] !== iterable.value[index]) {
        return false;
      }
    });

    return true;
  }

  isEmpty() {
    return this.value.length === 0;
  }

  count() {
    return this.value.length;
  }
}

class MalList extends MalIterable {
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
}

class MalVector extends MalIterable {
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

  count() {
    return 0;
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
  MalIterable,
  MalList,
  MalVector,
  MalBool,
  MalNil,
  MalFunction,
};
