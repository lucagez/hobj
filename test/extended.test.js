/**
 * Testing extended methods
 * CLEAR / SUB / FOR / FORDEEP / KEYS / SIZE / SIZEDEEP / ENTRIES
 */

import test from 'ava';
import MegaObj from '../dist/megaobj';

/**
 * CLEAR
 */
test('Should empty store', (t) => {
  const m = new MegaObj({ hello: 'world' });
  m._clear();
  t.deepEqual(m.store, {});
});

/**
 * SUB
 */
test('Should create a completely new sub-copy', (t) => {
  const m = new MegaObj({ h: { ello: 'world' } });
  // This is a deep copy
  const sub = m._sub('h');
  // this is a reference
  const obj = m._get('h');
  t.not(sub, obj);
});

test('Should clone the entire object', (t) => {
  const m = new MegaObj({ h: { ello: 'world' } });
  // This is a deep copy
  const sub = m._sub();
  t.not(sub, m.store);
});

/**
 * FOR
 */
test('Should iterate over each top level prop', (t) => {
  const m = new MegaObj({
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
  const m = new MegaObj({
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
  const m = new MegaObj({
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
  const m = new MegaObj({
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
  const m = new MegaObj({
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
  const m = new MegaObj({
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
  m._forDeep()((value, path) => values.push(path));
  values.forEach((path, i) => {
    t.is(path, expected[i]);
  });
});

test.todo('When starting at deepness => path is relative to starting object => must pass `start + path`')
