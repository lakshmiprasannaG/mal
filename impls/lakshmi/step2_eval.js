const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const {
  MalSymbol,
  MalList,
  MalVector,
  MalNumber,
  MalBool,
} = require('./types');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const env = {
  '+': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value + num.value)),

  '-': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value - num.value)),

  '*': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value * num.value)),

  '/': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value / num.value)),

  '=': (a, b) => new MalBool(a.equals(b)),
};

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) {
    return env[ast.value];
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

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

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
