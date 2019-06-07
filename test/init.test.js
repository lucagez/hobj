/**
 * Instantiate every method wehn creating a new megaobj.
 */

import test from 'ava';
import MegaObj from '../dist/megaobj';

const m = new MegaObj();
const methods = [
  'get',
  'set',
  'has',
  'delete',
  'clear',
  'sub',
  'for',
  'keys',
  'size',
  'sizeDeep',
  'entries',
  'forDeep',
];

const nonHooked = [
  '_get',
  '_set',
  '_has',
  '_delete',
  '_clear',
  '_sub',
  '_for',
  '_keys',
  '_size',
  '_sizeDeep',
  '_entries',
  '_forDeep',
];

test('Should have every hooked method', (t) => {
  methods
    .forEach(method => t.assert(typeof m[method] === 'function'));
});

test('Should have every non hooked method', (t) => {
  nonHooked
    .forEach(method => t.assert(typeof m[method] === 'function'));
});

test('Should initialize to empty object', (t) => {
  const n = new MegaObj();
  t.deepEqual(n.store, {});
});

test('Should initialize to provided object', (t) => {
  const n = new MegaObj({ hello: 'world' });
  t.assert(n.store.hello === 'world');
});
