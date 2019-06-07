
// Executing every function with the passed value as argument
const every = funcs => (...args) => funcs.forEach(func => func(...args));

// Coercing input to string to avoid errors when splitting.
// NOTE: a js object stringify every property (1 => '1').
const split = str => String(str).split('.');

function storeSelect(start = '') {
  return start !== '' ? this._get(start) : this.store;
}

function on(when) {
  return function scoped(method, func) {
    const actual = Array.from(
      this[`${when}Q`].get(method) || [],
    );
    const queue = [...actual, func];

    this[`${when}Q`].set(method, queue);
  };
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
  on,
  every,
  split,
  wrapper,
  storeSelect,
};
