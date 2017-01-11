'use strict';

const pg = require('pg');

function getStatements() {
  return {
    test1: 'SELECT * FROM events LIMIT 2',
    test2: 'SELECT * FROM s3imports LIMIT 4',
    test3: 'SELECT * FROM s3imports WHERE prefix = $1 LIMIT 3'
  }
};

function getDBClient() {
  return new pg.Client({
    user: process.env.dbUser,
    database: process.env.db,
    password: process.env.dbPassword,
    host: process.env.dbHost,
    port: process.env.port,
  });
}

function connectDB(dbClient) {
  return new Promise((resolve, reject) => {
    dbClient.connect(function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function executeQuery(dbClient, stmt, params) {
  return () => {
    return new Promise((resolve, reject) => {
      dbClient.query(stmt, params, function (error, result) {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}

exports.handler = function(event, context, callback) {
  const queryStringParameters = event.queryStringParameters || {};
  if (event.pathParameters.datasetname) {
    const datasetname = event.pathParameters.datasetname;
    const parameterArray = [];
    for (let i = 1; i < 10; i++) {
      if (queryStringParameters['p' + i]) {
        parameterArray.push(queryStringParameters['p' + i]);
      }
    }

    const client = getDBClient();
    connectDB(client)
        .then(executeQuery(client, getStatements()[datasetname], parameterArray))
        .then((result) => {
          const responseBody = JSON.stringify(result.rows);
          const response = {
            statusCode: 200,
            headers: {},
            body: responseBody
          };
          callback(null, response);
          return Promise.resolve();
        })
        .catch((error) => {
          console.log(error);
          const response = {
            statusCode: 500,
            headers: {},
            body: '{ "message": "An error occured, please check the logfiles." }'
          };
          callback(null, response);
        })
        .then(() => {
          client.end();
        });
    // responseBody = ;
  } else {
    const responseBody = JSON.stringify(Object.getOwnPropertyNames(getStatements()));
    const response = {
      statusCode: 200,
      headers: {},
      body: responseBody
    };
    callback(null, response);
  }
};
