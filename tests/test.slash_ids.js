/*globals initTestDB: false, emit: true, generateAdapterUrl: false, strictEqual: false */
/*globals PERSIST_DATABASES: false, initDBPair: false, utils: true */
/*globals ajax: true, LevelPouch: true */
/*globals cleanupTestDatabases: false */

"use strict";

var adapters = ['local-1', 'http-1'];
var qunit = module;
var LevelPouch;

if (typeof module !== undefined && module.exports) {
  Pouch = require('../src/pouch.js');
  LevelPouch = require('../src/adapters/pouch.leveldb.js');
  utils = require('./test.utils.js');

  for (var k in utils) {
    global[k] = global[k] || utils[k];
  }
  qunit = QUnit.module;
}

adapters.map(function(adapter) {

  qunit('Doc IDs with forward-slash' + adapter, {
    setup: function() {
      this.name = generateAdapterUrl(adapter);
    },
    teardown: cleanupTestDatabases
  });

  var doc = {
    // escape _id, otherwise Pouch will store it as an attachment
    // ...this appears to be by design
    _id: encodeURIComponent('foo/bar'),
    title: 'Bar'
  };

  asyncTest('put doc, get all docs', function() {
    var self = this;
    initTestDB(this.name, function(err, db) {
      db.put(doc, function (err, res) {
        db.get(encodeURIComponent('foo/bar'), function (err, doc) {
          // make sure it's not a 404
          ok(doc);

          if (doc) {
            strictEqual(doc.title, 'Bar');
            // the escaped forward-slash should not be used for doc's id
            strictEqual(doc._id, 'foo/bar');
          }
          start();
        });
      });
    });
  });

});
