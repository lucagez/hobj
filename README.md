# Hobj
> 🔪 Handy object manipulation tools

# Installation

With NPM:
```bash
npm install --save hobj
```

Without:
```html
<script src="https://unpkg.com/lucagez/hobj/dist/hobj.umd.js"></script>
```

# How hooks work

`Hobj` will provide hooks to execute functions before/after a method is executed.
This is done by executing in order:
```bash
=> BEFORE queue
=> fulfilled promise executing AFTER queue
=> called METHOD
```
This way, a micro-task is scheduled thanks to the already fulfilled promise.
So, the AFTER queue will always be executed after the called METHOD. Precisely on `nextTick`.

This will guarantee the order:
1. **BEFORE**
2. **METHOD**
3. **AFTER** 

# Usage

## Init Hobj

```javascript
const Hobj = require('hobj');

const obj = new Hobj();
```

