const pg = require('pg');

function getDBClient() {
  return new pg.Client({
    user: filetransferlib.dbUser,
    database: filetransferlib.db,
    password: filetransferlib.dbPassword,
    host: filetransferlib.dbHost,
    port: 5432,
  });
}


exports.handler = function(event, context, callback) {
  console.log(event);
  console.log(process.env);
  callback(null, [event, process.env]);
};
