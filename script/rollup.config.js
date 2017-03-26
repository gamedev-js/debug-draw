'use strict';

const fsJetpack = require('fs-jetpack');
const pjson = require('../package.json');

let banner = `
/*
 * ${pjson.name} v${pjson.version}
 * (c) ${new Date().getFullYear()} @Johnny Wu
 * Released under the MIT License.
 */
`;

let dest = './dist';
let file = 'debug-draw';
let moduleName = 'ddraw';

// clear directory
fsJetpack.dir(dest, { empty: true });

module.exports = {
  entry: './index.js',
  targets: [
    { dest: `${dest}/${file}.dev.js`, format: 'iife' },
    { dest: `${dest}/${file}.js`, format: 'cjs' },
  ],
  moduleName,
  banner,
  external: [
    'input',
    'vmath',
    'regl'
  ],
  globals: {
    'input': 'window.Input',
    'vmath': 'window.vmath',
    'regl': 'window.createREGL'
  },
  sourceMap: true,
};