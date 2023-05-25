const eval = (...args) => args[0];
const printLine = (...args) => {
  console.log(args[0]);
};

const logWithoutTrailingNewline = (input) => {
  process.stdout.write(input);
};

const readLine = () => {
  return new Promise((resolve) => {
    logWithoutTrailingNewline('user> ');

    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (line) => {
      resolve(line);
    });
  });
};

const myRepl = () => readLine().then(eval).then(printLine).then(myRepl);

myRepl();

/* 
const read = (...args) => args[0];

const rep = (...args) => {
  console.log(print(eval(read(...args))));
};

const main = () => {
  logWithoutTrailingNewline('user> ');

  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (line) => {
    rep(line);
    logWithoutTrailingNewline('user> ');
  });
};

main();
*/
