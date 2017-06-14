import klaw from 'klaw';
import path from 'path';

const mainDirectory = process.argv[2];
const pwd = process.cwd();
const resolvedDirectory = path.resolve(pwd, mainDirectory);

var items = []; // files, directories, symlinks, etc
klaw(resolvedDirectory)
  .on('readable', function () {
    var item;
    while ((item = this.read())) {
      items.push(item.path);
    }
  })
  .on('end', function () {
    // console.dir(items); // => [ ... array of files]
    console.log('size', items.length);
  });

