# GraphQL Guru JsonDB
A local storagelowDB JSON database and client for GraphQL Guru.


## Installation
1) In a terminal run `npm install graphql-guru-jsondb`

2) In environment.js add the path to the json storage file and optionally add default to seed the database on creation.

    server/environment.js
```
    database: {
      jsondb: {
        storage: 'path/to/json/file',
        defaults: { people : [] }
      }
```

3) In index-database.js import graphql-guru-jsondb and add it to the database object.

    server/core/database/index-database.js
```
    import * as jsondb from 'graphql-guru-jsondb';

    export const databases = {
      jsondb
    };

```

4) extend resolverQuery and resolverMutation with JsonDBQuery and JsonDBMutation respectively.

    server/modules/resolverQuery.js
    ```
    import { JsonDBQuery } from 'graphql-guru-jsondb';

    export default class People extends JsonDBQuery {
    }
    ```

    server/modules/resolverMutation.js
    ```
    import { JsonDBMutation } from 'graphql-guru-jsondb';

    export default class People extends JsonDBMutation {
    }
    ```
5) Add the methods to your schema files

server/modules/schemaQuery.js
```
peopleResolve(id: String): People
peopleFindAll(id: String): [People]
peopleFindById(id: String): People
peopleFindManyById(id: [String]): [People]
```

server/modules/schemaMutation.js
```
# Add description
peopleCreate(
  firstName: String,
  lastName:  String
): People

# Add description
peopleRemove (
  id: String
): People

# Add description
peopleUpdate(
  id:        String,
  firstName: String,
  lastName:  String
): People
```

# Usage


# Database methods
For database usage see [lowDB](https://github.com/typicode/lowdb)

# License
MIT
