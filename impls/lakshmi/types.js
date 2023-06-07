const pr_str = (malValue, printReadably = true) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str(printReadably);
  }

  return malValue.toString();
};

class MalValue {
  constructor(value) {
    this.value = value;
  }

  pr_str(printReadably) {
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

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(printReadably) {
    if (printReadably) {
      return (
        '"' +
        this.value
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n') +
        '"'
      );
    }
    return this.value;
  }
}

class MalKeyword extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str() {
    return this.value;
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

  nth(n) {
    if (n.value > this.value.length) throw 'index out of bound';
    return this.value[n.value];
  }

  first() {
    if (this.isEmpty()) return new MalNil();
    return this.value[0];
  }

  rest() {
    return new MalList(this.value.slice(1));
  }
}

class MalList extends MalIterable {
  constructor(value) {
    super(value);
  }

  pr_str(printReadably) {
    return (
      '(' + this.value.map((x) => pr_str(x, printReadably)).join(' ') + ')'
    );
  }

  beginsWith(startValue) {
    return this.value.length > 0 && this.value[0].value === startValue;
  }
}

class MalVector extends MalIterable {
  constructor(value) {
    super(value);
  }

  pr_str(printReadably) {
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

class MalHashMap extends MalValue {
  constructor(value) {
    super(value);
  }

  pr_str(printReadably) {
    return (
      '{' +
      this.value
        .map((x) => {
          if (x instanceof MalValue) {
            return x.pr_str();
          }
          return x;
        })
        .join(' ') +
      '}'
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
  constructor(ast, params, env, fn, isMacro = false) {
    super(ast);
    this.params = params;
    this.env = env;
    this.fn = fn;
    this.isMacro = isMacro;
  }

  pr_str() {
    return '#<function>';
  }

  apply(_, args) {
    return this.fn.apply(null, args);
  }
}

class MalAtom extends MalValue {
  constructor(value) {
    super(value);
  }

  deref() {
    return this.value;
  }

  reset(value) {
    this.value = value;
    return this.value;
  }

  pr_str() {
    return '(atom ' + this.value.pr_str() + ')';
  }

  swap(fn, args) {
    this.value = fn.apply(null, [this.value, ...args]);
    return this.value;
  }
}

module.exports = {
  MalValue,
  MalNumber,
  MalSymbol,
  MalString,
  MalIterable,
  MalList,
  MalVector,
  MalHashMap,
  MalBool,
  MalNil,
  MalFunction,
  MalAtom,
  MalKeyword,
  pr_str,
};
