import React from 'react';
import {Platform} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

var conn = null;
if (Platform.OS === 'ios') {
  var conn = SQLite.openDatabase(
    {name: 'example.db', createFromLocation: 1},
    ok => {console.log("conn ok")},
    error => {console.log("conn err")},
  );
} else {
  var conn = SQLite.openDatabase(
    {name: 'example.db', createFromLocation: '~example.db'},
    ok => {},
    error => {},
  );
}
const DB = () => {
  const select = (query, params, cb) => {
    conn.transaction(tr => {
      tr.executeSql(
        query,
        params,
        (tr, results) => {
          var rows = [];
          for (var i = 0; i < results.rows.length; i++) {
            rows.push(results.rows.item(i));
          }
          cb(rows);
        },
        err => {},
      );
    });
  };

  const insert = (query, params, cb) => {
    conn.transaction(tr => {
      tr.executeSql(
        query,
        params,
        (tr, results) => {
          cb(true);
        },
        err => {
          cb(false);
        },
      );
    });
  };

  return {
    select,
    insert,
  };
};

export default DB;
