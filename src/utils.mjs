
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
    let execution;
    Promise
      .resolve()
      // Passing both the args used for the method invocation and the result of the method
      .then(() => every(this.afterQ.get(method) || [])(...args, execution));

    // MIDDLE
    return (() => {
      // Computing the result and saving it in a ariable that will be picked up
      // during AFTER execution.

      // NOTE: the wrapper function will return the result before
      // starting the after queue.
      const result = this[`_${method}`](...args);
      execution = result;
      return result;
    })();
  };
}

export {
  on,
  every,
  split,
  wrapper,
  storeSelect,
};
