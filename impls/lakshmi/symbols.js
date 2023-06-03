const {
  MalSymbol,
  MalList,
  MalBool,
  MalNil,
  MalValue,
  MalIterables,
  MalNumber,
} = require('./types');

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

  env.set(new MalSymbol('='), (a, b) => new MalBool(a.equals(b)));

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
