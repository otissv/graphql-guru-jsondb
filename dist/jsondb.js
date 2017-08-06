'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JsonDBMutation = exports.JsonDBQuery = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.promise = promise;
exports.connect = connect;

var _lowdb = require('lowdb');

var _lowdb2 = _interopRequireDefault(_lowdb);

var _classAutobind = require('class-autobind');

var _classAutobind2 = _interopRequireDefault(_classAutobind);

var _v = require('uuid/v4');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function promise(fn) {
  return new Promise(function (resolve, reject) {
    return fn(resolve, reject);
  });
}

function connect(_ref) {
  var _ref$defaults = _ref.defaults,
      defaults = _ref$defaults === undefined ? null : _ref$defaults,
      storage = _ref.storage;

  // path to json database file
  var dbPath = storage.substr(0, 1) === '/' ? '' + process.cwd() + storage.substr(0, 1) : process.cwd() + '/' + storage;

  // initialize database;
  var db = (0, _lowdb2.default)(dbPath);

  // get database state
  var state = db.getState();

  // if database is empty add default tables
  if (Object.keys(state).length === 0) {
    db.defaults(defaults).write();
  }

  return db;
}

var JsonDBQuery = exports.JsonDBQuery = function () {
  function JsonDBQuery() {
    _classCallCheck(this, JsonDBQuery);

    (0, _classAutobind2.default)(this);
  }

  _createClass(JsonDBQuery, [{
    key: 'resolve',
    value: function resolve(params) {
      return Array.isArray(params.args) ? this.findManyById(_extends({}, params, { args: { id: params.args } })) : this.findById(params);
    }
  }, {
    key: 'findAll',
    value: function findAll(_ref2) {
      var args = _ref2.args,
          databases = _ref2.databases,
          models = _ref2.models;

      var db = databases.jsondb;
      var TABLE = this.table;

      return promise(function (resolve, reject) {
        var data = db.get(TABLE).value();
        resolve(data);
      }).catch(function (error) {
        return process.stdout.write(error);
      });
    }
  }, {
    key: 'findById',
    value: function findById(_ref3) {
      var query = _ref3.query,
          args = _ref3.args,
          databases = _ref3.databases,
          models = _ref3.models;

      var db = databases.jsondb;
      var obj = args || query;
      var TABLE = this.table;

      return promise(function (resolve, reject) {
        var data = db.get(TABLE).find({ id: obj.id }).value();

        resolve(data);
      }).catch(function (error) {
        return process.stdout.write(error);
      });
    }
  }, {
    key: 'findManyById',
    value: function findManyById(_ref4) {
      var query = _ref4.query,
          args = _ref4.args,
          databases = _ref4.databases,
          models = _ref4.models;

      var db = databases.jsondb;
      var obj = args || query;
      var TABLE = this.table;
      var ids = obj.id.map(function (id) {
        return { id: id };
      });

      return promise(function (resolve, reject) {
        var table = db.get(TABLE).value();

        var data = ids.reduce(function (previous, item) {
          var insert = table.filter(function (record) {
            return record.id === item.id;
          });

          return [].concat(_toConsumableArray(previous), _toConsumableArray(insert));
        }, []);

        resolve(data);
      }).catch(function (error) {
        return process.stdout.write(error);
      });
    }
  }]);

  return JsonDBQuery;
}();

var JsonDBMutation = exports.JsonDBMutation = function () {
  function JsonDBMutation() {
    _classCallCheck(this, JsonDBMutation);

    (0, _classAutobind2.default)(this);
  }

  _createClass(JsonDBMutation, [{
    key: 'create',
    value: function create(_ref5) {
      var args = _ref5.args,
          databases = _ref5.databases,
          models = _ref5.models;

      var db = databases.jsondb;
      var TABLE = this.table;
      var id = (0, _v2.default)();

      return promise(function (resolve, reject) {
        var data = db.get(TABLE).push(_extends({}, args, { id: id })).write().filter(function (item) {
          return item.id === id;
        });

        resolve(data[0]);
      });
    }
  }, {
    key: 'remove',
    value: function remove(_ref6) {
      var args = _ref6.args,
          databases = _ref6.databases,
          models = _ref6.models;

      var db = databases.jsondb;
      var id = args.id;
      var TABLE = this.table;

      return promise(function (resolve, reject) {
        var data = db.get(TABLE).remove({ id: args.id }).write().filter(function (item) {
          return item.id === id;
        });

        resolve(data[0]);
      }).catch(function (error) {
        return process.stdout.write(error);
      });
    }
  }, {
    key: 'update',
    value: function update(_ref7) {
      var args = _ref7.args,
          databases = _ref7.databases,
          models = _ref7.models;

      var db = databases.jsondb;
      var id = args.id;
      var TABLE = this.table;

      return promise(function (resolve, reject) {
        var data = db.get(TABLE).find({ id: args.id }).assign(_extends({}, args)).write().filter(function (item) {
          return item.id === id;
        });

        resolve(data[0]);
      }).catch(function (error) {
        return process.stdout.write(error);
      });
    }

    // createMany
    // deleteMany
    // removeMany
    // updateMany

  }]);

  return JsonDBMutation;
}();
//# sourceMappingURL=jsondb.js.map