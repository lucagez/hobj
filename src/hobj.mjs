import { on, wrapper, storeSelect } from './utils';
import _methods from './methods';

export default class Hobj {
  constructor(init = {}) {
    this.store = init;

    // Storing the queues to be executed before and after each method
    this.beforeQ = new Map();
    this.afterQ = new Map();

    // There are two version of every method.
    this.methods = Object
      .keys(_methods)
      .map(pure => ({ pure, normal: pure.replace('_', '') }));

    // - Normal version `method` => is ALWAYS hooked.
    // before/after queue will be executed when invoking a normal method.

    // - Pure version `_method` => Pure method. No hooks.

    // Setting pure methods
    this.methods
      .forEach(({ pure }) => this[pure] = _methods[pure].bind(this));

    // Setting hooked (normal) version.
    this.methods
      .forEach(({ normal }) => this[normal] = wrapper(normal).bind(this));

    this.storeSelect = storeSelect.bind(this);
    this.before = on('before').bind(this);
    this.after = on('after').bind(this);
  }
}
