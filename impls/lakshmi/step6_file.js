const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalFunction,
  MalHashMap,
} = require('./types');
const { Env } = require('./env.js');
const { ns } = require('./core.js');

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
  const newAst = new MalList([new MalSymbol('do'), ...forms]);

  return [letEnv, newAst];
};

const eval_do = (ast, env) => {
  const formsResult = ast.slice(0, -1).map((form) => EVAL(form, env));
  return ast[ast.length - 1];
};

const eval_if = (ast, env) => {
  const [predicate, if_block, else_block] = ast.value.slice(1);

  const evalOfPredicate = EVAL(predicate, env).value;

  if (evalOfPredicate === false || evalOfPredicate === null) {
    return else_block ?? new MalNil();
  }

  return if_block;
};

const eval_fn = (ast, env) => {
  const [params, ...fnBody] = ast.value.slice(1);
  const doForms = new MalList([new MalSymbol('do'), ...fnBody]);

  const fn = (...args) => {
    const newEnv = new Env(env, params.value, args);
    return EVAL(doForms, newEnv);
  };
  return new MalFunction(doForms, params, env, fn);
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

  if (ast instanceof MalHashMap) {
    const newAst = ast.value.map((x) => EVAL(x, env));

    for (let index = 0; index < newAst.length; index += 2) {
      env.set(newAst[index], newAst[index + 1]);
    }

    return new MalHashMap(newAst);
  }

  return ast;
};

const EVAL = (ast, env) => {
  while (true) {
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
        [env, ast] = eval_let(ast, env);
        break;

      case 'do':
        ast = eval_do(ast.value.slice(1), env);
        break;

      case 'if':
        ast = eval_if(ast, env);
        break;

      case 'fn*':
        ast = eval_fn(ast, env);
        break;
      default:
        const [fn, ...args] = eval_ast(ast, env).value;

        if (fn instanceof MalFunction) {
          ast = fn.value;
          env = new Env(fn.env, fn.params.value, args);
        } else {
          return fn.apply(null, args);
        }
    }
  }
};

const READ = (str) => read_str(str);

const PRINT = (malValue) => pr_str(malValue, true);

const rep = (str) => PRINT(EVAL(READ(str), env));

const env = new Env();

const createReplEnv = () => {
  const nsList = Object.keys(ns);
  nsList.forEach((symbol) => env.set(new MalSymbol(symbol), ns[symbol]));

  env.set(new MalSymbol('eval'), (ast) => EVAL(ast, env));

  rep(
    '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
  );

  return env;
};

createReplEnv();

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
