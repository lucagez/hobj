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
  m._for('', value => values.push(value));
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
  m._for('b', value => values.push(value));
  t.is(values.length, 3);
});
