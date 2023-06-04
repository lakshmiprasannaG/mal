const { Env } = require('./env.js');

const { MalSymbol, MalList, MalBool, MalNumber } = require('./types');

const ns = {
  '+': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value + num.value)),

  '-': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value - num.value)),

  '*': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value * num.value)),

  '/': (...args) =>
    args.reduce((context, num) => new MalNumber(context.value / num.value)),

  '=': (a, b) => new MalBool(a.equals(b)),

  '>': (a, b) => new MalBool(a.value > b.value),

  '<': (a, b) => new MalBool(a.value < b.value),

  '<=': (a, b) => new MalBool(a.value <= b.value),

  '>=': (a, b) => new MalBool(a.value >= b.value),

  list: (...args) => new MalList(args),

  'list?': (arg) => arg instanceof MalList,

  'empty?': (arg) => arg.isEmpty(),

  count: (arg) => {
    return new MalNumber(arg.count());
  },

  prn: (...args) => {
    return args.slice(-1)[0];
  },
};

const createReplEnv = () => {
  const env = new Env();
  const nsList = Object.keys(ns);
  nsList.forEach((symbol) => env.set(new MalSymbol(symbol), ns[symbol]));
  return env;
};

module.exports = { createReplEnv };
