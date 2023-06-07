const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const {
  MalSymbol,
  MalList,
  MalVector,
  MalNil,
  MalFunction,
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

  return ast;
};

const handleDefMacro = (ast, env) => {
  const macro = EVAL(ast.value[2], env);
  macro.isMacro = true;
  env.set(ast.value[1], macro);
  return env.get(ast.value[1]);
};

const isMacroCall = (ast, env) => {
  try {
    return (
      ast instanceof MalList &&
      !ast.isEmpty() &&
      ast.value[0] instanceof MalSymbol &&
      env.get(ast.value[0]).isMacro
    );
  } catch {
    return false;
  }
};

const macroexpand = (ast, env) => {
  while (isMacroCall(ast, env)) {
    const macro = env.get(ast.value[0]);
    ast = macro.apply(null, ast.value.slice(1));
  }
  return ast;
};

const quasiQuote = (ast, env) => {
  if (ast instanceof MalList && ast.beginsWith('unquote')) {
    return ast.value[1];
  }

  if (ast instanceof MalList) {
    let result = new MalList([]);

    for (let index = ast.value.length - 1; index >= 0; index--) {
      const element = ast.value[index];

      if (element instanceof MalList && element.beginsWith('splice-unquote')) {
        result = new MalList([
          new MalSymbol('concat'),
          element.value[1],
          result,
        ]);
      } else {
        result = new MalList([
          new MalSymbol('cons'),
          quasiQuote(element, env),
          result,
        ]);
      }
    }
    return result;
  }

  if (ast instanceof MalSymbol) {
    return new MalList([new MalSymbol('quote'), ast]);
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

    ast = macroexpand(ast, env);
    if (!(ast instanceof MalList)) {
      return eval_ast(ast, env);
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

      case 'quote':
        return ast.value[1];

      case 'quasiquoteexpand':
        return quasiQuote(ast.value[1], env);

      case 'quasiquote':
        ast = quasiQuote(ast.value[1], env);
        break;

      case 'defmacro!':
        return handleDefMacro(ast, env);

      case 'macroexpand':
        return macroexpand(ast.value[1], env);

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

  rep('(def! not (fn* (a) (if a false true)))');

  rep(
    '(defmacro! cond (fn* (& xs) (if (> (count xs) 0) (list \'if (first xs) (if (> (count xs) 1) (nth xs 1) (throw "odd number of forms to cond")) (cons \'cond (rest (rest xs)))))))'
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
