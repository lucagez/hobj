/**
 * Testing before/after hook functionality.
 */

import test from 'ava';

const esm = require('esm')({});

const { wrapper } = esm(`${__dirname}/../src/utils.mjs`);


// Creating a fake context to be used as `this` from wrapper function.
// Emulating megaobj behavior.

// String used to test effectiveness of queues.
let testStr = '';

const beforeQ = new Map([
  ['get', [
    () => testStr += '0',
    () => testStr += '1',
    () => testStr += '2',
    () => testStr += '3',
  ]],
]);

const afterQ = new Map([
  ['get', [
    () => testStr += '4',
    () => testStr += '5',
    () => testStr += '6',
    () => testStr += '7',
  ]],
]);


const context = {
  beforeQ,
  afterQ,
  _get: () => 'get',
};

const method = wrapper('get').bind(context);

test.beforeEach(() => {
  testStr = '';
});

test.serial('It should execute method function', (t) => {
  const result = method();
  t.is(result, 'get');
});

test.serial('Functions in beforeQ should execute', (t) => {
  method();
  t.is(testStr, '0123');
});

test.serial('Functions in afterQ should execute', (t) => {
  method();
  return new Promise((resolve) => {
    setTimeout(() => {
      t.truthy(testStr.match('4567'));
      resolve();
    }, 10);
  });
});
