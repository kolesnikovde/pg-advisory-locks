# pg-advisory-locks

PostgreSQL advisory locks utils for node.js.

### Installation

    $ npm i pg-advisory-locks

### Usage

```js
var pg    = require('pg');
var locks = require('pg-advisory-locks');

var url = 'postgres://localhost/postgres';

pg.connection(url, function(err, db) {
  if (err) throw err;

  locks.withLock(db, 'test-lock', function() {
    // lock acquired
  });
});
```

### API

```js
lock(db, name)
unlock(db, name)
withLock(db, name, fn)
tryLock(db, name)
xactLock(db, name)
tryXactLock(db, name)
```

### License

MIT
