import low from 'lowdb';
import autobind from 'class-autobind';
import uuid from 'uuid/v4';

export function promise (fn) {
  return new Promise((resolve, reject) => fn(resolve, reject));
}

export function connect ({ defaults = null, storage }) {
  // path to json database file
  const dbPath = storage.substr(0, 1) === '/'
    ? `${process.cwd()}${storage.substr(0, 1)}`
    : `${process.cwd()}/${storage}`;

  // initialize database;
  const db = low(dbPath);

  // get database state
  const state = db.getState();

  // if database is empty add default tables
  if (Object.keys(state).length === 0) {
    db.defaults(defaults).write();
  }
  
  return db;
}

export class JsonDBQuery {
  constructor () {
    autobind(this);
  }

  resolve (params) {
    return Array.isArray(params.args)
      ? this.findManyById({ ...params, args: { id: params.args } })
      : this.findById(params);
  }

  findAll ({ args, databases, models }) {
    const db = databases.jsondb;
    const TABLE = this.table;

    return promise((resolve, reject) => {
      const data = db.get(TABLE).value();
      resolve(data);
    })
      .catch(error => process.stdout.write(error));
  }

  findById ({ query, args, databases, models }) {
    const db = databases.jsondb;
    let obj = args || query;
    const TABLE = this.table;

    return promise((resolve, reject) => {
      const data = db
        .get(TABLE)
        .find({ id : obj.id })
        .value();

      resolve(data);    
    })
      .catch(error => process.stdout.write(error));
  }

  findManyById ({ query, args, databases, models }) {
    const db = databases.jsondb;
    let obj = args || query;
    const TABLE = this.table;
    const ids = obj.id.map(id => ({ id }));

    return promise((resolve, reject) => {
      const table = db.get(TABLE).value();

      const data = ids.reduce((previous, item) => {
        const insert = table.filter(record => record.id === item.id);

        return [
          ...previous,
          ...insert
        ];
      }, []);

      resolve(data);
    })
      .catch(error => process.stdout.write(error));
  }
}

export class JsonDBMutation {
  constructor () {
    autobind(this);
  }

  create ({ args, databases, models }) {
    const db = databases.jsondb;
    const TABLE = this.table;
    const id = uuid();

    return promise((resolve, reject) => {
      const data = db.get(TABLE)
        .push({ ...args, id })
        .write()
        .filter(item => item.id === id);

      resolve(data[0]);
    });
  }

  remove ({ args, databases, models }) {
    const db = databases.jsondb;
    const id = args.id;
    const TABLE = this.table;

    return promise((resolve, reject) => {
      const data = db.get(TABLE)
        .remove({ id: args.id })
        .write()
        .filter(item => item.id === id);

      resolve(data[0]);
    })
      .catch(error => process.stdout.write(error));
  }

  update ({ args, databases, models }) {
    const db = databases.jsondb;
    const id = args.id;
    const TABLE = this.table;

    return promise((resolve, reject) => {
      const data = db.get(TABLE)
        .find({ id: args.id })
        .assign({ ...args })
        .write()
        .filter(item => item.id === id);

      resolve(data[0]);
    })
      .catch(error => process.stdout.write(error));
  }

  // createMany
  // deleteMany
  // removeMany
  // updateMany
}
