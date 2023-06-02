const { MalSymbol, MalList, MalBool, MalNil, MalValue } = require('./types');

const areEqual = (firstElement, secondElement) => {
  if (firstElement.value.length != secondElement.value.length) {
    return false;
  }

  for (let index = 0; index < firstElement.value.length; index++) {
    if (firstElement.value[index] != secondElement.value[index]) {
      return false;
    }
  }
  return true;
};

const initializeEnvWithSymbols = (env) => {
  env.set(new MalSymbol('+'), (...args) =>
    args.reduce((context, num) => context + num)
  );

  env.set(new MalSymbol('-'), (...args) =>
    args.reduce((context, num) => context - num)
  );

  env.set(new MalSymbol('*'), (...args) =>
    args.reduce((context, num) => context * num)
  );

  env.set(new MalSymbol('/'), (...args) =>
    args.reduce((context, num) => context / num)
  );

  env.set(new MalSymbol('='), (a, b) => {
    if (a instanceof MalValue && b instanceof MalValue) {
      return new MalBool(areEqual(a, b));
    }

    return new MalBool(a === b);
  });

  env.set(new MalSymbol('>'), (a, b) => new MalBool(a > b));

  env.set(new MalSymbol('<'), (a, b) => new MalBool(a < b));

  env.set(new MalSymbol('<='), (a, b) => new MalBool(a <= b));

  env.set(new MalSymbol('>='), (a, b) => new MalBool(a >= b));

  env.set(new MalSymbol('list'), (...args) => new MalList(args));

  env.set(new MalSymbol('list?'), (arg) => arg instanceof MalList);

  env.set(new MalSymbol('empty?'), (arg) => arg.isEmpty());

  env.set(new MalSymbol('count'), (arg) => {
    if (arg instanceof MalNil) {
      return 0;
    }

    if (arg instanceof MalValue) {
      return arg.length();
    }

    return 1;
  });

  env.set(new MalSymbol('prn'), (...args) => {
    return args.slice(-1)[0];
  });
};

module.exports = { initializeEnvWithSymbols };
