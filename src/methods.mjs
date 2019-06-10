import { split } from './utils';

// Reducing object to final value
function _get(path) {
  return split(path).reduce((a, b) => a && a[b], this.store);
}

function _has(path) {
  return typeof this._get(path) !== 'undefined';
}

function _delete(path, obj = this.store, acc = null) {
  const props = acc || split(path);
  const first = props[0];
  if (typeof obj[first] === 'undefined') return false;
  if (props.length === 1) {
    delete obj[first];
    return true;
  }
  props.shift();
  return _delete(path, obj[first], props);
}

function _set(path, value, obj = this.store, acc = null, ref = this.store) {
  const props = acc || split(path);
  const first = props[0];
  if (!obj) return;
  if (typeof obj[first] === 'undefined') {
    obj[first] = {};
  }
  if (props.length === 1) {
    obj[first] = value;
    return ref;
  }
  props.shift();
  return _set(path, value, obj[first], props, ref);
}

// If no path is provided `_sub` acts like a deep clone
// for the entire object.
function _sub(path) {
  return JSON.parse(
    JSON.stringify(
      path ? this._get(path) : this.store,
    ),
  );
}

function _for(path) {
  return (func) => {
    if (typeof func !== 'function') throw new TypeError('Func must be a function');

    const store = this.storeSelect(path);
    for (const prop in store) {
      func(prop, store[prop]);
    }
  };
}

function _forDeep(path = '', end = true) {
  const store = this.storeSelect(path);
  return (func, ref) => {
    if (typeof func !== 'function') throw new TypeError('Func must be a function');

    (function scoped(obj, acc = []) {
      if (typeof obj === 'undefined') return;

      const usedPath = path + acc.join('.');
      if (end) {
        // An array is actually considered an object.
        // However, in the context of a js object, is an end property.
        if (typeof obj !== 'object' || Array.isArray(obj)) func(usedPath, obj);
      } else func(usedPath, obj);


      if (typeof obj !== 'object') return;
      // Recursively going deeper.
      // NOTE: While going deeper, the current prop is pushed into the accumulator
      // to keep track of the position inside of the object.
      return Object
        .keys(obj)
        .map(prop => scoped(obj[prop], [...acc, prop]));
    }(ref || store));
  };
}

// DEEP merge utility.
// Simply iterating and setting.
function _merge(ref = {}) {
  this._forDeep('', true)((path, value) => this._set(path, value), ref);
  return this.store;
}

function _size(path) {
  const store = this.storeSelect(path);
  return Object.keys(store).length;
}

function _sizeDeep(path, end = true) {
  let c = 0;
  this._forDeep(path, end)(() => c += 1);
  return c;
}

function _keys(path) {
  const store = this.storeSelect(path);
  return Object.keys(store);
}

function _entries(path) {
  const store = this.storeSelect(path);
  return this._keys(path).map(prop => [prop, store[prop]]);
}

function _clear() {
  this.store = {};
}

export default {
  _get,
  _set,
  _has,
  _delete,
  _clear,
  _sub,
  _for,
  _keys,
  _size,
  _sizeDeep,
  _entries,
  _forDeep,
  _merge,
};
