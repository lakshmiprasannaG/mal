const { MalSymbol, MalList } = require('./types');

const initializeEnvWithEnvs = (env) => {
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

  env.set(new MalSymbol('='), (a, b) => a === b);

  env.set(new MalSymbol('list'), (...args) => new MalList(args));

  env.set(new MalSymbol('list?'), (arg) => arg instanceof MalList);

  env.set(new MalSymbol('empty?'), (arg) => arg.isEmpty());

  env.set(new MalSymbol('count'), (arg) => arg.length);

  env.set(new MalSymbol('prn'), (...args) => {
    console.log(...args);
    return args.slice(-1)[0];
  });
};

module.exports = { initializeEnvWithEnvs };
