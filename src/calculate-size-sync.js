import assert from 'assert';
import debug from 'debug';
import { fs } from 'mz';
import path from 'path';

const mainDirectory = process.argv[2];
assert.ok(mainDirectory, 'Please provide a directory path as first param.');

const pwd = process.cwd();
const resolvedDirectory = path.resolve(pwd, mainDirectory);
debug('resolvedDirectory', resolvedDirectory);

// Source: https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
function humanFormat(bytes) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  let i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)), 10);
  if (i > 0) {
    i -= 1;
  }
  return `${Math.round((bytes / (1024 ** i)))} ${sizes[i]}`;
}

function calculateSizeSync(absolutePath, depth) {
  let localTotalBytes = 0;
  const localDepth = depth + 1;
  const files = fs.readdirSync(absolutePath);
  let items = files.length;

  files.forEach((file) => {
    const fileAbsolutePath = path.resolve(absolutePath, file);
    let stats;
    try {
      stats = fs.statSync(fileAbsolutePath);
    } catch (e) {
      console.error(e.message);
    }
    localTotalBytes += stats.size || 0;
    // console.log(fileAbsolutePath, stats.isDirectory(), humanFormat(stats.size), humanFormat(localTotalBytes));

    if (stats.isDirectory()) {
      const children = calculateSizeSync(fileAbsolutePath, localDepth);
      localTotalBytes += children.size;
      items += children.items;
    }
  });

  // console.log(localDepth, humanFormat(localTotalBytes));
  // console.log(localTotalBytes);
  return { items, size: localTotalBytes };
}

console.time('calculateSizeSync');
const result = calculateSizeSync(resolvedDirectory, 0);
console.log('Final:', `${result.items} items`, humanFormat(result.size));
console.timeEnd('calculateSizeSync');
