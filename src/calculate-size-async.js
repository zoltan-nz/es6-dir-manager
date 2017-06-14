import assert from 'assert';
import debug from 'debug';
import _ from 'lodash';
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

async function calculateSize(absolutePath, depth) {
  let localTotalBytes = 0;
  const localDepth = depth + 1;
  let files;
  try {
    files = await fs.readdir(absolutePath);
  } catch (e) {
    console.error('fs.readdir error');
  }
  let items = files.length;

  const filesWithStats = await Promise.all(files.map((file) => {
    const fileAbsolutePath = path.resolve(absolutePath, file);
    let s;
    try {
      s = fs.stat(fileAbsolutePath);
    } catch (e) {
      console.error('fs stat error');
    }
    return { s, file };
  }));

  localTotalBytes = _.sum(filesWithStats.map(async f => await f.s.size || 0));

  // console.log(fileAbsolutePath, stats.isDirectory(), humanFormat(stats.size), humanFormat(localTotalBytes));

  const children = Promise.all(filesWithStats.map((f) => {
    const fileAbsoluthPath = path.resolve(absolutePath, f.file);
    if (f.s.isDirectory()) {
      return calculateSize(fileAbsoluthPath, localDepth);
    }
    return { size: 0, items: 0 };
  }));

  localTotalBytes += children.size;
  items += children.items;

  console.log(localDepth, humanFormat(localTotalBytes));
  // console.log(localTotalBytes);
  return { items, size: localTotalBytes };
}

(async (dir) => {
  console.time('calculateSize');
  const result = await calculateSize(dir, 0);
  console.log('Final:', `${result.items} items`, humanFormat(result.size));
  console.timeEnd('calculateSize');
})(resolvedDirectory);
