const {
  MalSymbol,
  MalList,
  MalVector,
  MalHashMap,
  MalBool,
  MalNil,
  MalNumber,
  MalString,
  MalKeyword,
} = require('./types.js');

class Reader {
  constructor(token) {
    this.token = token;
    this.position = 0;
  }

  peek() {
    return this.token[this.position];
  }

  next() {
    const token = this.peek();
    this.position++;
    return token;
  }
}

const tokenize = (str) => {
  const re =
    /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;

  return [...str.matchAll(re)].map((x) => x[1]).slice(0, -1);
};

const read_seq = (reader, closingSymbol) => {
  reader.next();
  const ast = [];

  while (reader.peek() != closingSymbol) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }

  reader.next();

  return ast;
};

const read_list = (reader) => {
  const ast = read_seq(reader, ')');

  return new MalList(ast);
};

const read_vector = (reader) => {
  const ast = read_seq(reader, ']');

  return new MalVector(ast);
};

const isEven = (num) => num % 2 === 0;

const read_hash_map = (reader) => {
  const ast = read_seq(reader, '}');

  if (!isEven(ast.length)) {
    throw 'unbalanced';
  }

  return new MalHashMap(ast);
};

const createMalString = (str) => {
  const string = str.replace(/\\(.)/g, (_, captured) =>
    captured === 'n' ? '\n' : captured
  );

  return new MalString(string);
};

const read_atom = (reader) => {
  const token = reader.next();

  if (token.match(/^-?[0-9]+$/)) {
    return new MalNumber(parseInt(token));
  }

  if (token === 'true') return new MalBool(true);

  if (token === 'false') return new MalBool(false);

  if (token === 'nil') return new MalNil();

  if (token.startsWith(':')) return new MalKeyword(token);

  if (token.startsWith('"')) {
    // if (!token.match(/^".*"$/)) {
    //   throw 'unbalanced';
    // }

    const newToken = token.slice(1, -1);
    // It's looping twice => debug this behaviour
    return createMalString(newToken);
  }

  return new MalSymbol(token);
};

const prependSymbol = (reader, symbol) => {
  reader.next();
  return new MalList([new MalSymbol(symbol), read_form(reader)]);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    case '{':
      return read_hash_map(reader);
    case "'":
      return prependSymbol(reader, 'quote');
    case '`':
      return prependSymbol(reader, 'quasiquote');
    case '~':
      return prependSymbol(reader, 'unquote');
    case '~@':
      return prependSymbol(reader, 'splice-unquote');
    case '@':
      return prependSymbol(reader, 'deref');
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str).filter((str) => !str.startsWith(';'));
  const reader = new Reader(tokens);
  return read_form(reader);
};

exports.read_str = read_str;
