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

function wrapper(method) {
  return function scoped() {
    var this$1 = this;
    var ref;

    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];
    // BEFORE
    every(this.beforeQ.get(method) || []).apply(void 0, args); // AFTER
    // (microtask executed on nextTick)
    // NOTE: using Promise for keeping browser compatibility.

    Promise.resolve().then(function () { return every(this$1.afterQ.get(method) || []).apply(void 0, args); }); // MIDDLE

    return (ref = this)[("_" + method)].apply(ref, args);
  };
}

function on(when) {
  return function scoped(method, func) {
    var actual = Array.from(this[(when + "Q")].get(method) || []);
    var queue = actual.concat( [func]);
    this[(when + "Q")].set(method, queue);
  };
} // Reducing object to final value


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

function _set(path, value, obj, acc) {
  if ( obj === void 0 ) obj = this.store;
  if ( acc === void 0 ) acc = null;

  var props = acc || split(path);
  var first = props[0];
  if (!obj) { return; }

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

function _sub(path) {
  return JSON.parse(JSON.stringify(this._get(path)));
}

function _forDeep(start, end) {
  if ( end === void 0 ) end = true;

  var store = this.storeSelect(start);
  return function (func) {
    if (typeof func !== 'function') { throw new TypeError('Func must be a function'); }

    (function scoped(obj, acc) {
      if ( acc === void 0 ) acc = [];

      if (typeof obj === 'undefined') { return; }
      var path = acc.join('.');

      if (end) {
        if (typeof obj !== 'object') { func(obj, path); }
      } else { func(obj, path); } // Recursively going deeper.
      // NOTE: While going deeper, the current prop is pushed into the accumulator
      // to keep track of the position inside of the object.


      return Object.keys(obj).map(function (prop) { return scoped(obj[prop], acc.concat( [prop])); });
    })(store);
  };
}

function _size(start) {
  var store = this.storeSelect(start);
  return Object.keys(store).length;
}

function _sizeDeep(start, end) {
  if ( end === void 0 ) end = true;

  var c = 0;

  this._forDeep(start, end)(function () { return c += 1; });

  return c;
}

function _for(start, func) {
  var store = this.storeSelect(start);

  for (var prop in store) {
    func(prop);
  }
}

function _keys(start) {
  var store = this.storeSelect(start);
  return Object.keys(store);
}

function _entries(start) {
  var this$1 = this;

  return this._keys(start).map(function (prop) { return [prop, this$1.store[prop]]; });
}

function _clear() {
  this.store = {};
}

var MegaObj = function MegaObj(init) {
  var this$1 = this;
  if ( init === void 0 ) init = {};

  this.store = init; // Storing the queues to be executed before and after each method

  this.beforeQ = new Map();
  this.afterQ = new Map();
  this._get = _get.bind(this);
  this._set = _set.bind(this);
  this._has = _has.bind(this);
  this._delete = _delete.bind(this);
  this._clear = _clear.bind(this);
  this._sub = _sub.bind(this);
  this._for = _for.bind(this);
  this._keys = _keys.bind(this);
  this._entries = _entries.bind(this);
  this._forDeep = _forDeep.bind(this);
  this._size = _size.bind(this);
  this._sizeDeep = _sizeDeep.bind(this);
  this.methods.forEach(function (method) { return this$1[method] = wrapper(method).bind(this$1); });
  this.storeSelect = storeSelect.bind(this);
  this.before = on('before').bind(this);
  this.after = on('after').bind(this);
};
MegaObj.prototype.methods = ['get', 'set', 'has', 'delete', 'clear', 'sub', 'for', 'keys', 'size', 'sizeDeep', 'entries', 'forDeep'];

export default MegaObj;
//# sourceMappingURL=megaobj.mjs.map
