const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalSymbol, MalList, MalVector } = require('./types');
const { Env } = require('./env.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env.get(ast);
  }

  if (ast instanceof MalList) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalList(newAst);
  }

  if (ast instanceof MalVector) {
    const newAst = ast.value.map((x) => EVAL(x, env));
    return new MalVector(newAst);
  }

  return ast;
};

const EVAL = (ast, env) => {
  if (!(ast instanceof MalList)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  const specialForm = ast.value[0].value;
  switch (specialForm) {
    case 'def!':
      env.set(ast.value[1], EVAL(ast.value[2], env));
      return env.get(ast.value[1]);

    case 'let*':
      const letEnv = new Env(env);
      const bindingList = ast.value[1].value;

      for (let index = 0; index < bindingList.length; index = index + 2) {
        const key = bindingList[index];
        const value = bindingList[index + 1];
        letEnv.set(key, EVAL(value, letEnv));
      }

      const astLastElement = ast.value.slice(-1)[0];

      if (astLastElement instanceof MalSymbol) {
        return EVAL(astLastElement, letEnv);
      }

      return EVAL(astLastElement, letEnv);
  }

  const [fn, ...args] = eval_ast(ast, env).value;

  return fn.apply(null, args);
};

const env = new Env();
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

const READ = (str) => read_str(str);

const PRINT = (malValue) => pr_str(malValue);

const rep = (str) => PRINT(EVAL(READ(str), env));

const repl = () =>
  rl.question('user> ', (line) => {
    try {
      console.log(rep(line));
    } catch (error) {
      console.log(error);
    }
    repl();
  });

repl();
