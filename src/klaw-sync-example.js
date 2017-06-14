import klawSync from 'klaw-sync';
import path from 'path';

const mainDirectory = process.argv[2];
const pwd = process.cwd();
const resolvedDirectory = path.resolve(pwd, mainDirectory);

var items = klawSync(resolvedDirectory);
console.log('length', items.length);

