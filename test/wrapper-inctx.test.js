/**
 * Testing before/after hook functionality.
 */

import test from 'ava';
import Hobj from '../dist/hobj';

test('Can set and execute before funcs', (t) => {
  const m = new Hobj();
  let executed = false;
  m.before('get', () => executed = true);
  m.get('test');
  t.is(executed, true);
});

test('Can set and execute multiple before funcs', (t) => {
  const m = new Hobj();
  const executed = [];
  m.before('get', () => executed.push(1));
  m.before('get', () => executed.push(2));
  m.get('test');
  t.is(executed.length, 2);
});

test('Can set and execute after funcs', (t) => {
  const m = new Hobj();
  let executed = false;
  m.after('get', () => executed = true);
  m.get('test');
  return new Promise((resolve) => {
    setTimeout(() => {
      t.is(executed, true);
      resolve();
    }, 10);
  });
});

test('Can set and execute multiple after funcs', (t) => {
  const m = new Hobj();
  const executed = [];
  m.after('get', () => executed.push(1));
  m.after('get', () => executed.push(1));
  m.get('test');
  return new Promise((resolve) => {
    setTimeout(() => {
      t.is(executed.length, 2);
      resolve();
    }, 10);
  });
});
