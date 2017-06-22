import klaw from 'klaw';
import path from 'path';

const mainDirectory = process.argv[2];
const pwd = process.cwd();
const resolvedDirectory = path.resolve(pwd, mainDirectory);

const items = []; // files, directories, symlinks, etc
klaw(resolvedDirectory)
  .on('readable', function () {
    let item = this.read();
    while (item) {
      items.push(item.path);
      item = this.read();
    }
  })
  .on('end', () => {
    // console.dir(items); // => [ ... array of files]
    console.log('size', items.length);
  });

