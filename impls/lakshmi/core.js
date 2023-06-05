const fs = require('fs');
const { Env } = require('./env.js');
const { read_str } = require('./reader.js');
const { pr_str } = require('./printer.js');
const {
  MalSymbol,
  MalList,
  MalBool,
  MalNumber,
  MalNil,
  MalVector,
  MalString,
} = require('./types');

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

  vector: (...args) => new MalVector(args),

  list: (...args) => new MalList(args),

  'list?': (arg) => arg instanceof MalList,

  'empty?': (arg) => arg.isEmpty(),

  count: (arg) => {
    return new MalNumber(arg.count());
  },

  prn: (...args) => {
    args.forEach((arg) => console.log(arg.value));
    return new MalNil();
  },

  'pr-str': (...args) => args.map((arg) => pr_str(arg, true)).join(' '),

  str: (...args) =>
    new MalString(args.map((arg) => pr_str(arg, false)).join('')),

  'read-string': (string) => read_str(string.value),

  slurp: (filename) => new MalString(fs.readFileSync(filename.value, 'utf8')),
};

module.exports = { ns };
