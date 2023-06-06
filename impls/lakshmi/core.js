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
  MalAtom,
  MalKeyword,
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

  vec: (args) => new MalVector(args.value.slice()),

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

  println: (...args) => {
    const string = args.map((arg) => pr_str(arg, false)).join(' ');
    console.log(string);
    return new MalNil();
  },

  'read-string': (string) => read_str(string.value),

  slurp: (filename) => new MalString(fs.readFileSync(filename.value, 'utf8')),

  atom: (value) => new MalAtom(value),

  'atom?': (value) => value instanceof MalAtom,

  deref: (atom) => atom.deref(),

  'reset!': (atom, value) => atom.reset(value),

  '*ARGV*': () => new MalList(read_str(...process.argv.slice(2))),

  'swap!': (atom, fn, ...args) => {
    return atom.swap(fn, args);
  },

  cons: (value, list) => new MalList([value, ...list.value]),

  concat: (...lists) => new MalList(lists.flatMap((x) => x.value)),
};

module.exports = { ns };
