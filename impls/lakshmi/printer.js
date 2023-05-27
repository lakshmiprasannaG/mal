const { MalValue } = require('./types.js');

const pr_str = (malValue) => {
  if (malValue instanceof MalValue) {
    return malValue.pr_str();
  }
  return malValue.toString();
};

exports.pr_str = pr_str;
