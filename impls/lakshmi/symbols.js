const {
  MalSymbol,
  MalList,
  MalBool,
  MalNil,
  MalValue,
  MalIterables,
  MalNumber,
} = require('./types');

const areEqual = (firstElement, secondElement) => {
  if (firstElement.value.length !== secondElement.value.length) {
    return false;
  }

  // if array take 1st Element  areEqual(arr[0], arr1[0]);

  for (let index = 0; index < firstElement.value.length; index++) {
    if (firstElement.value[index] !== secondElement.value[index]) {
      return false;
    }
  }
  return true;
};

const initializeEnvWithSymbols = (env) => {
  env.set(new MalSymbol('+'), (...args) =>
    args.reduce((context, num) => new MalNumber(context.value + num.value))
  );

  env.set(new MalSymbol('-'), (...args) =>
    args.reduce((context, num) => new MalNumber(context.value - num.value))
  );

  env.set(new MalSymbol('*'), (...args) =>
    args.reduce((context, num) => new MalNumber(context.value * num.value))
  );

  env.set(new MalSymbol('/'), (...args) =>
    args.reduce((context, num) => new MalNumber(context.value / num.value))
  );

  env.set(new MalSymbol('='), (a, b) => {
    return new MalBool(a.equals(b));
  });

  env.set(new MalSymbol('>'), (a, b) => new MalBool(a.value > b.value));

  env.set(new MalSymbol('<'), (a, b) => new MalBool(a.value < b.value));

  env.set(new MalSymbol('<='), (a, b) => new MalBool(a.value <= b.value));

  env.set(new MalSymbol('>='), (a, b) => new MalBool(a.value >= b.value));

  env.set(new MalSymbol('list'), (...args) => new MalList(args));

  env.set(new MalSymbol('list?'), (arg) => arg instanceof MalList);

  env.set(new MalSymbol('empty?'), (arg) => arg.isEmpty());

  env.set(new MalSymbol('count'), (arg) => {
    if (arg instanceof MalNil) {
      return new MalNumber(0);
    }

    if (arg instanceof MalValue) {
      return new MalNumber(arg.value.length);
    }

    return new MalNumber(1);
  });

  env.set(new MalSymbol('prn'), (...args) => {
    return args.slice(-1)[0];
  });
};

module.exports = { initializeEnvWithSymbols };
