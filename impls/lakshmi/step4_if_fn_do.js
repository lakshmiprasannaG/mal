const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalSymbol, MalList, MalVector, MalNil } = require('./types');
const { Env } = require('./env.js');
const { createReplEnv } = require('./core.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_let = (ast, env) => {
  const letEnv = new Env(env);

  const bindingList = ast.value[1].value;
  const forms = ast.value.slice(2);

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
};

const eval_do = (ast, env) => {
  const formsResult = ast.map((form) => EVAL(form, env));
  return formsResult[formsResult.length - 1];
};

const eval_if = (ast, env) => {
  const [predicate, if_block, else_block] = ast.value.slice(1);

  const evalOfPredicate = EVAL(predicate, env).value;

  const isTrue =
    evalOfPredicate !== false && evalOfPredicate !== new MalNil().value;

  if (isTrue) {
    return EVAL(if_block, env);
  }

  if (else_block === undefined) {
    return new MalNil();
  }
  return EVAL(else_block, env);
};

const eval_fn = (ast, env) => {
  const inner_fn = (...args) => {
    const exprs = new MalList(args);
    const [binds, body] = ast.value.slice(1);
    const fnEnv = new Env(env, binds.value, exprs.value);
    return EVAL(body, fnEnv);
  };

  inner_fn.toString = () => '#<function>';
  return inner_fn;
};

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
      return eval_let(ast, env);

    case 'do':
      return eval_do(ast.value.slice(1), env);

    case 'if':
      return eval_if(ast, env);

    case 'fn*':
      return eval_fn(ast, env);
  }

  const [fn, ...args] = eval_ast(ast, env).value;
  return fn.apply(null, args);
};

const env = createReplEnv();

const READ = (str) => read_str(str);

const PRINT = (malValue) => {
  return pr_str(malValue);
};

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
