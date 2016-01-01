var pg      = require('pg');
var assert  = require('assert');
var locks   = require('./');
var Promise = require('bluebird')

describe('pg-advisory-locks', function() {
  var url = process.env.DB || 'postgres://localhost/postgres',
      db;

  before(function(done) {
    pg.connect(url, function(err, conn) {
      if (err) throw err;

      db = conn;
      done();
    });
  });

  it('locks and unlock', function(done) {
    locks
      .lock(db, 'test-lock')
      .then(function() {
        locks
          .unlock(db, 'test-lock')
          .then(function(acquired) {
            if (acquired) {
              done();
            } else {
              done('Lock is not acquired');
            }
          });
      });
  });

  it('invokes function with lock', function(done) {
    locks
      .withLock(db, 'test-lock', function() {
        new Promise(function(resolve, reject) {
          setTimeout(resolve, 100);
        });
      })
      .then(function() {
        locks
          .tryLock(db, 'test-lock')
          .then(function(acquired) {
            if (acquired) {
              done();
            } else {
              done('Lock is acquired');
            }
          });
      });
  });
});
