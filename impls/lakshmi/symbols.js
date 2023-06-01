const { MalSymbol, MalList, MalBool, MalNil, MalValue } = require('./types');

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
    if ((a instanceof MalList) & (b instanceof MalList)) {
      return a.isEqualTo(b);
    }
    return a === b;
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
    console.log(...args);
    return args.slice(-1)[0];
  });
};

module.exports = { initializeEnvWithSymbols };
