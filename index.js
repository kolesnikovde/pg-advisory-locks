'use strict';

var Promise = require('bluebird');
var hash    = require('string-hash');

function lockPromise(db, lockFn, name) {
  return new Promise(function(resolve, reject) {
    name = typeof name === 'number' ? name.toFixed(0) : hash(name);

    db.query('SELECT ' + lockFn + '(' + name + ')', function(err, result) {
      err ? reject(err) : resolve(result.rows[0][lockFn]);
    });
  });
}

module.exports = {
  lock: function(db, name) {
    return lockPromise(db, 'pg_advisory_lock', name);
  },

  unlock: function(db, name) {
    return lockPromise(db, 'pg_advisory_unlock', name);
  },

  withLock: function(db, name, fn) {
    return this.lock(db, name)
               .then(fn)
               .finally(this.unlock.bind(this, db, name));
  },

  tryLock: function(db, name) {
    return lockPromise(db, 'pg_try_advisory_lock', name);
  },

  xactLock: function(db, name) {
    return lockPromise(db, 'pg_advisory_xact_lock', name);
  },

  tryXactLock: function(db, name) {
    return lockPromise(db, 'pg_try_advisory_xact_lock', name);
  },
}
