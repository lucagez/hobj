import { split } from './utils';

function on(when) {
  return function scoped(method, func) {
    const actual = Array.from(
      this[`${when}Q`].get(method) || [],
    );
    const queue = [...actual, func];

    this[`${when}Q`].set(method, queue);
  };
}

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

function _set(path, value, obj = this.store, acc = null) {
  const props = acc || split(path);
  const first = props[0];
  if (!obj) return;
  if (typeof obj[first] === 'undefined') {
    obj[first] = {};
    if (props.length === 1) {
      obj[first] = value;
      return this.store;
    }
  }
  props.shift();
  return _set(path, value, obj[first], props);
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

function _forDeep(start = '', end = true) {
  const store = this.storeSelect(start);
  return (func) => {
    if (typeof func !== 'function') throw new TypeError('Func must be a function');

    (function scoped(obj, acc = []) {
      if (typeof obj === 'undefined') return;

      const path = start + acc.join('.');
      if (end) {
        if (typeof obj !== 'object') func(obj, path);
      } else func(obj, path);


      // Recursively going deeper.
      // NOTE: While going deeper, the current prop is pushed into the accumulator
      // to keep track of the position inside of the object.
      return Object
        .keys(obj)
        .map(prop => scoped(obj[prop], [...acc, prop]));
    }(store));
  };
}

function _size(start) {
  const store = this.storeSelect(start);
  return Object.keys(store).length;
}

function _sizeDeep(start, end = true) {
  let c = 0;
  this._forDeep(start, end)(() => c += 1);
  return c;
}

function _for(start) {
  return (func) => {
    const store = this.storeSelect(start);
    for (const prop in store) {
      func(prop);
    }
  };
}

function _keys(start) {
  const store = this.storeSelect(start);
  return Object.keys(store);
}

function _entries(start) {
  return this._keys(start).map(prop => [prop, this.store[prop]]);
}

function _clear() {
  this.store = {};
}

export {
  on,
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
};
