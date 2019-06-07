import { wrapper } from './utils';
import {
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
} from './methods';

export default class MegaObj {
  constructor(init = {}) {
    this.store = init;

    // Storing the queues to be executed before and after each method
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

    this.methods
      .forEach(method => this[method] = wrapper(method).bind(this));

    this.before = on('before').bind(this);
    this.after = on('after').bind(this);
  }
}

MegaObj.prototype.methods = [
  'get',
  'set',
  'has',
  'delete',
  'clear',
  'sub',
  'for',
  'keys',
  'size',
  'sizeDeep',
  'entries',
  'forDeep',
];
