import chalk from 'chalk';
import Debug from 'debug';
import * as _ from 'lodash';
import { fs } from 'mz';
import * as path from 'path';

const debug = Debug('dir-manager');

export function getName(absolutePath) {
  return path.basename(absolutePath);
}

export function getStatsSync(filePath) {
  let stat = false;
  try {
    stat = fs.statSync(filePath);
  } catch (e) {
    debug(chalk.red(e.message));
    if (e.code === 'ELOOP') {
      debug(chalk.red('There is an infinite loop symlink in your directory structure, please fix it!'));
    }
    if (e.code === 'ENOENT') {
      debug(chalk.red('This symlink is probably broken: '), filePath);
    }
  }
  return stat;
}

export function getChildrenSync(absolutePath) {
  const stat = getStatsSync(absolutePath);

  let childrenFileNames = [];
  try {
    if (stat && stat.isDirectory()) {
      childrenFileNames = fs.readdirSync(absolutePath);
    }
  } catch (e) {
    debug(chalk.red('Cannot read directory'), e.code, absolutePath);
  }

  return childrenFileNames.map(name => path.resolve(absolutePath, name));
}

export function buildTreeSync(absolutePath) {
  const tree = {};

  const name = getName(absolutePath);
  const children = getChildrenSync(absolutePath);

  tree[name] = _.isEmpty(children)
    ? ''
    : children.map(child => buildTreeSync(child));

  return tree;
}

