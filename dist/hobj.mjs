// Executing every function with the passed value as argument
var every = function (funcs) { return function () {
  var args = [], len = arguments.length;
  while ( len-- ) args[ len ] = arguments[ len ];

  return funcs.forEach(function (func) { return func.apply(void 0, args); });
 }  }; // Coercing input to string to avoid errors when splitting.
// NOTE: a js object stringify every property (1 => '1').


var split = function (str) { return String(str).split('.'); };

function storeSelect(start) {
  if ( start === void 0 ) start = '';

  return start !== '' ? this._get(start) : this.store;
}

function on(when) {
  return function scoped(method, func) {
    var actual = Array.from(this[(when + "Q")].get(method) || []);
    var queue = actual.concat( [func]);
    this[(when + "Q")].set(method, queue);
  };
}

function wrapper(method) {
  return function scoped() {
    var this$1 = this;
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    // BEFORE
    every(this.beforeQ.get(method) || []).apply(void 0, args); // AFTER
    // (microtask executed on nextTick)
    // NOTE: using Promise for keeping browser compatibility.

    var execution;
    Promise.resolve() // Passing both the args used for the method invocation and the result of the method
    .then(function () { return every(this$1.afterQ.get(method) || []).apply(void 0, args.concat( [execution] )); }); // MIDDLE

    return (function () {
      var ref;

      // Computing the result and saving it in a ariable that will be picked up
      // during AFTER execution.
      // NOTE: the wrapper function will return the result before
      // starting the after queue.
      var result = (ref = this$1)[("_" + method)].apply(ref, args);
      execution = result;
      return result;
    })();
  };
}

function _get(path) {
  return split(path).reduce(function (a, b) { return a && a[b]; }, this.store);
}

function _has(path) {
  return typeof this._get(path) !== 'undefined';
}

function _delete(path, obj, acc) {
  if ( obj === void 0 ) obj = this.store;
  if ( acc === void 0 ) acc = null;

  var props = acc || split(path);
  var first = props[0];
  if (typeof obj[first] === 'undefined') { return false; }

  if (props.length === 1) {
    delete obj[first];
    return true;
  }

  props.shift();
  return _delete(path, obj[first], props);
}

function _set(path, value, obj, acc, ref) {
  if ( obj === void 0 ) obj = this.store;
  if ( acc === void 0 ) acc = null;
  if ( ref === void 0 ) ref = this.store;

  var props = acc || split(path);
  var first = props[0];
  if (!obj) { return; }

  if (typeof obj[first] === 'undefined') {
    obj[first] = {};

    if (props.length === 1) {
      obj[first] = value;
      return ref;
    }
  }

  props.shift();
  return _set(path, value, obj[first], props, ref);
} // If no path is provided `_sub` acts like a deep clone
// for the entire object.


function _sub(path) {
  return JSON.parse(JSON.stringify(path ? this._get(path) : this.store));
}

function _for(path) {
  var this$1 = this;

  return function (func) {
    if (typeof func !== 'function') { throw new TypeError('Func must be a function'); }
    var store = this$1.storeSelect(path);

    for (var prop in store) {
      func(prop, store[prop]);
    }
  };
}

function _forDeep(path, end) {
  if ( path === void 0 ) path = '';
  if ( end === void 0 ) end = true;

  var store = this.storeSelect(path);
  return function (func) {
    if (typeof func !== 'function') { throw new TypeError('Func must be a function'); }

    (function scoped(obj, acc) {
      if ( acc === void 0 ) acc = [];

      if (typeof obj === 'undefined') { return; }
      var usedPath = path + acc.join('.');

      if (end) {
        // An array is actually considered an object.
        // However, in the context of a js object, is an end property.
        if (typeof obj !== 'object' || Array.isArray(obj)) { func(usedPath, obj); }
      } else { func(usedPath, obj); } // Recursively going deeper.
      // NOTE: While going deeper, the current prop is pushed into the accumulator
      // to keep track of the position inside of the object.


      return Object.keys(obj).map(function (prop) { return scoped(obj[prop], acc.concat( [prop])); });
    })(store);
  };
}

function _size(path) {
  var store = this.storeSelect(path);
  return Object.keys(store).length;
}

function _sizeDeep(path, end) {
  if ( end === void 0 ) end = true;

  var c = 0;

  this._forDeep(path, end)(function () { return c += 1; });

  return c;
}

function _keys(path) {
  var store = this.storeSelect(path);
  return Object.keys(store);
}

function _entries(path) {
  var store = this.storeSelect(path);
  return this._keys(path).map(function (prop) { return [prop, store[prop]]; });
}

function _clear() {
  this.store = {};
}

var _methods = {
  _get: _get,
  _set: _set,
  _has: _has,
  _delete: _delete,
  _clear: _clear,
  _sub: _sub,
  _for: _for,
  _keys: _keys,
  _size: _size,
  _sizeDeep: _sizeDeep,
  _entries: _entries,
  _forDeep: _forDeep
};

var Hobj = function Hobj(init) {
  var this$1 = this;
  if ( init === void 0 ) init = {};

  this.store = init; // Storing the queues to be executed before and after each method

  this.beforeQ = new Map();
  this.afterQ = new Map(); // There are two version of every method.

  this.methods = Object.keys(_methods).map(function (pure) { return ({
    pure: pure,
    normal: pure.replace('_', '')
  }); }); // - Normal version `method` => is ALWAYS hooked.
  // before/after queue will be executed when invoking a normal method.
  // - Pure version `_method` => Pure method. No hooks.
  // Setting pure methods

  this.methods.forEach(function (ref) {
    var pure = ref.pure;

    return this$1[pure] = _methods[pure].bind(this$1);
  }); // Setting hooked (normal) version.

  this.methods.forEach(function (ref) {
    var normal = ref.normal;

    return this$1[normal] = wrapper(normal).bind(this$1);
  });
  this.storeSelect = storeSelect.bind(this);
  this.before = on('before').bind(this);
  this.after = on('after').bind(this);
};

export default Hobj;
//# sourceMappingURL=hobj.mjs.map
