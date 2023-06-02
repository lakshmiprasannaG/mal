class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str() {
    return this.value.toString();
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
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

  length() {
    return this.value.length;
  }

  isEqualTo(list) {
    if (this.length() != list.length()) {
      return false;
    }

    for (let index = 0; index < this.length(); index++) {
      if (this.value[index] != list.value[index]) {
        return false;
      }
    }
    return true;
  }

  isEmpty() {
    return this.value.length === 0;
  }
}

class MalVector extends MalValue {
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
  MalSymbol,
  MalList,
  MalVector,
  MalBool,
  MalNil,
  MalFunction,
};
