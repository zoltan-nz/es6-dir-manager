import path from 'path';
import glob from 'glob';

const mainDirectory = process.argv[2];
const pwd = process.cwd();
const resolvedDirectory = path.resolve(pwd, mainDirectory);

const options = { root: resolvedDirectory };

glob('/**', options, (er, files) => {
  console.log(files.length);
});

// const files = glob.sync('/**', options);
// console.log(files.length);
