/* eslint-disable */
const chalk = require('chalk');
const path = require('path');

const commitMessage = require('fs')
  .readFileSync(path.resolve('.git/COMMIT_EDITMSG'), 'utf-8')
  .trim();
console.log('=>(verify-commit.js:8) commitMessage', commitMessage);

const commitRegExp = /^(S|R\d+\r?\n(?:M|m)essage: .{1,50})/;
console.log('=>(verify-commit.js:11) commitRegExp', commitRegExp);

if (!commitRegExp.test(commitMessage)) {
  console.log();
  console.error(
    `    ${chalk.bgRed.white(' ERROR ')} ${chalk.red(`Invalid commit message format.`)}\n\n` +
      chalk.red(`    Proper commit message format as below. Example:\n\n`) +
      `    ${chalk.green(`S2222`)}\n` +
      `    ${chalk.green(`Message: feat(router): 修改文案字体大小`)}\n\n`,
  );
  process.exit(1);
}
