const { MalValue } = require('./types.js');

const pr_str = (malValue, printReadably = false) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str(printReadably);
  }

  return malValue.toString();
};

exports.pr_str = pr_str;
