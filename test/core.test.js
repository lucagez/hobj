/**
 * Testing the core methods of megaobj.
 * GET / SET / HAS / DELETE
 */


import test from 'ava';
import MegaObj from '../dist/megaobj';

/**
 * GET
 */
test('Get should return a result', (t) => {
  const m = new MegaObj({ hello: 'world' });
  const result = m._get('hello');
  t.is(result, 'world');
});

test('Get should return a nested result', (t) => {
  const m = new MegaObj({ hello: { w: 'orld' } });
  const result = m._get('hello.w');
  t.is(result, 'orld');
});

test('Get should return undefined if non-existent path', (t) => {
  const m = new MegaObj({ hello: { w: 'orld' } });
  const result = m._get('hello.wo1rld');
  t.is(result, undefined);
});

test('Get should not throw if something other than string is passed', (t) => {
  const m = new MegaObj({ hello: { w: 'orld' } });
  const result = () => m._get(234);
  t.notThrows(result);
});

/**
 * SET
 */

test('Should set prop', (t) => {
  const m = new MegaObj();
  m._set('hello', 'world');
  t.deepEqual(m.store, { hello: 'world' });
});

test('Should set nested prop', (t) => {
  const m = new MegaObj();
  m._set('h.ello', 'world');
  t.deepEqual(m.store, { h: { ello: 'world' } });
});

test('Should not throw if path is not of type string', (t) => {
  const m = new MegaObj();
  const result = () => m._set(2, 'world');
  t.notThrows(result);
});

test('Should return store after succesfull set operation', (t) => {
  const m = new MegaObj();
  const result = m._set('hello', 'world');
  t.deepEqual(result, { hello: 'world' });
});

/**
 * HAS
 */
test('Should return false if obj does not have target property', (t) => {
  const m = new MegaObj();
  const result = m._has('hello');
  t.is(result, false);
});

test('Should return true if obj does have target property', (t) => {
  const m = new MegaObj();
  m._set('hello', 'world');
  const result = m._has('hello');
  t.is(result, true);
});

/**
 * DELETE
 */
test('Should return false if obj no prop match for deletion', (t) => {
  const m = new MegaObj();
  const result = m._delete('hello');
  t.is(result, false);
});

test('Should return true if prop is deleted correctly', (t) => {
  const m = new MegaObj();
  m._set('hello', 'world');
  const result = m._delete('hello');
  t.is(result, true);
});

test('After deletion, the resulting store does not have the deleted prop', (t) => {
  const m = new MegaObj({ hello: 'world' });
  m._delete('hello');
  const result = m._has('hello');
  t.is(result, false);
});

test('Delete should not throw if path is not of type string', (t) => {
  const m = new MegaObj();
  const result = () => m._delete(2);
  t.notThrows(result);
});
