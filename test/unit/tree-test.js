import { describe, it } from 'mocha';
import { fs } from 'mz';
import * as path from 'path';

import { buildTreeSync, getChildrenSync, getName, getStatsSync } from '../../src/tree';

const expect = require('chai').expect;

const FIXTURE_DIRECTORY = path.resolve(__dirname, '../fixtures/fixture-directory');
const FIXTURE_FILE = path.resolve(__dirname, '../fixtures/fixture-directory/file-1.txt');

describe('Tree Sync', () => {
  it('#getName - should return the file name', () => {
    expect(getName(FIXTURE_DIRECTORY)).equal('fixture-directory');
  });

  it('#getChildrenSync - should return an array of string of children path', () => {
    const dir1Directory = `${FIXTURE_DIRECTORY}/dir-1`;
    const file1 = FIXTURE_FILE;

    const children = getChildrenSync(FIXTURE_DIRECTORY);
    expect(children.length).equal(2);
    expect(children).deep.equal([dir1Directory, file1]);
  });

  it('#buildTreeSync - should return an Object', () => {
    const expected = {
      'fixture-directory': [
        {
          'dir-1': [
            {
              'dir-1-dir-2': [
                {
                  'false-symlink': '',
                },
                {
                  'file-2.txt': '',
                },
                {
                  symlink: '',
                },
              ],
            },
            {
              'file-3.txt': '',
            },
            {
              symdir: [
                {
                  'false-symlink': '',
                },
                {
                  'file-2.txt': '',
                },
                {
                  symlink: '',
                },
              ],
            },
          ],
        },
        {
          'file-1.txt': '',
        },
      ],
    };

    const tree = buildTreeSync(FIXTURE_DIRECTORY);
    expect(tree).deep.equal(expected);
  });

  it('#getStatsSync - should return with stat false when file can not be read', () => {
    expect(getStatsSync('not-existing.file'), 'not existing file should return false').to.be.false;
  });

  it('#getStatsSync - should return fs.Stats object', () => {
    const dir = getStatsSync(FIXTURE_DIRECTORY);
    const expected = fs.statSync(FIXTURE_DIRECTORY);

    expect(dir).deep.equal(expected);
  });
});
