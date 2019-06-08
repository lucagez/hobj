/**
 * Testing extended methods
 * CLEAR / SUB / FOR / FORDEEP / KEYS / SIZE / SIZEDEEP / ENTRIES
 */

import test from 'ava';
import Hobj from '../dist/hobj';

/**
 * CLEAR
 */
test('Should empty store', (t) => {
  const m = new Hobj({ hello: 'world' });
  m._clear();
  t.deepEqual(m.store, {});
});

/**
 * SUB
 */
test('Should create a completely new sub-copy', (t) => {
  const m = new Hobj({ h: { ello: 'world' } });
  // This is a deep copy
  const sub = m._sub('h');
  // this is a reference
  const obj = m._get('h');
  t.not(sub, obj);
});

test('Should clone the entire object', (t) => {
  const m = new Hobj({ h: { ello: 'world' } });
  // This is a deep copy
  const sub = m._sub();
  t.not(sub, m.store);
});

/**
 * FOR
 */
test('Should iterate over each top level prop', (t) => {
  const m = new Hobj({
    a: 0,
    b: 1,
    c: 2,
    d: 3,
  });

  const values = [];
  m._for()(value => values.push(value));
  t.is(values.length, 4);
});

test('Should iterate over each top level prop starting a defined deepness', (t) => {
  // In this case `b` is specified as staring object => so, the iteration will be
  // for each top-level property starting ad `b` deepnsess level => c, d, e
  const m = new Hobj({
    a: 0,
    b: {
      c: 0,
      d: 0,
      e: 0,
    },
  });

  const values = [];
  m._for('b')(value => values.push(value));
  t.is(values.length, 3);
});

/**
 * FOR DEEP
 */
test('Should iterate over each end property in the object, regardless the deepness', (t) => {
  const m = new Hobj({
    a: 0,
    b: {
      c: 0,
      d: 0,
      e: 0,
    },
  });

  // a, c, d, e are visited
  const values = [];
  m._forDeep()(value => values.push(value));
  t.is(values.length, 4);
});

test('Should iterate over EACH property in the object', (t) => {
  const m = new Hobj({
    a: 0,
    b: {
      c: 0,
      d: 0,
      e: 0,
    },
  });

  // a, c, d, e are visited AND b AND top-level
  const values = [];
  m._forDeep('', false)(value => values.push(value));
  t.is(values.length, 6);
});

test('Should iterate over each property in the object starting at defined deepness', (t) => {
  const m = new Hobj({
    a: 0,
    b: {
      c: 0,
      d: {
        f: 0,
        g: {
          h: 0,
          i: 0,
        },
      },
      e: 0,
    },
  });

  // Visiting each end property under b => c, f, h, i, e
  const values = [];
  m._forDeep('b')(value => values.push(value));
  t.is(values.length, 5);
});

test('Should pass current path as argument', (t) => {
  const m = new Hobj({
    a: 0,
    b: {
      c: 0,
      d: {
        f: 0,
        g: {
          h: 0,
          i: 0,
        },
      },
      e: 0,
    },
  });

  const expected = [
    'a',
    'b.c',
    'b.d.f',
    'b.d.g.h',
    'b.d.g.i',
    'b.e',
  ];

  // Visiting each end property under b => c, f, h, i, e
  const values = [];
  m._forDeep()(path => values.push(path));
  values.forEach((path, i) => {
    t.is(path, expected[i]);
  });
});

/**
 * SIZE
 */
test('Should count top level props', (t) => {
  const m = new Hobj({ a: 0, b: 0 });
  t.is(m._size(), 2);
});

test('Should count top level props, starting at deepness', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0 } });
  t.is(m._size('b'), 1);
});

/**
 * SIZE DEEP
 */
test('Should count each end prop', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0 } });
  t.is(m._sizeDeep(), 2);
});

test('Should count each end prop, starting at deepness', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0, d: { e: 0 } } });
  t.is(m._sizeDeep('b'), 2);
});

test('Should count each prop, starting at deepness', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0, d: { e: 0 } } });
  t.is(m._sizeDeep('b', false), 4);
});

/**
 * KEYS
 */
test('Should return every top-level key', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0, d: { e: 0 } } });
  t.is(m._keys().length, 2);
});

test('Should return every top-level key, starting at deepness', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0, d: { e: 0 } } });
  t.is(m._keys('b.d').length, 1);
});

/**
 * ENTRIES
 */
test('Should return a key/value array', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0 } });
  const expected = [
    ['a', 0],
    ['b', { c: 0 }],
  ];

  t.deepEqual(m._entries(), expected);
});

test('Should return a key/value array, starting at deepness', (t) => {
  const m = new Hobj({ a: 0, b: { c: 0, d: 0 } });
  const expected = [
    ['c', 0],
    ['d', 0],
  ];

  t.deepEqual(m._entries('b'), expected);
});
