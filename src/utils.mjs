
// Executing every function with the passed value as argument
const every = funcs => (...args) => funcs.forEach(func => func(...args));

// Coercing input to string to avoid errors when splitting.
// NOTE: a js object stringify every property (1 => '1').
const split = str => String(str).split('.');

function storeSelect(start = '') {
  return start !== '' ? this._get(start) : this.store;
}

function wrapper(method) {
  return function scoped(...args) {
    // BEFORE
    every(this.beforeQ.get(method) || [])(...args);

    // AFTER
    // (microtask executed on nextTick)
    // NOTE: using Promise for keeping browser compatibility.
    Promise
      .resolve()
      .then(() => every(this.afterQ.get(method) || [])(...args));

    // MIDDLE
    return this[`_${method}`](...args);
  };
}

export {
  every,
  split,
  wrapper,
  storeSelect,
};
