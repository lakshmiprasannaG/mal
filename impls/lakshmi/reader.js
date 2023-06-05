const {
  MalSymbol,
  MalList,
  MalVector,
  MalBool,
  MalNil,
  MalNumber,
  MalString,
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

const applyStrTransformations = (str) => {
  if (str.match('".*\\\\"')) {
    const backslashIndex = str.indexOf('\\"');
    return str.slice(0, backslashIndex);
  }

  return str;
};

const read_atom = (reader) => {
  const token = reader.next();

  if (token.match(/^-?[0-9]+$/)) {
    return new MalNumber(parseInt(token));
  }

  if (token === 'true') return new MalBool(true);

  if (token === 'false') return new MalBool(false);

  if (token === 'nil') return new MalNil();

  if (token.match(/^".*/)) {
    // const newToken = applyStrTransformations(token);

    if (!token.match(/^".*"$/)) {
      throw 'unbalanced';
    }

    return new MalString(token);
  }

  return new MalSymbol(token);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case '(':
      return read_list(reader);
    case '[':
      return read_vector(reader);
    default:
      return read_atom(reader);
  }
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

exports.read_str = read_str;
