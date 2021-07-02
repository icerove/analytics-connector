const moment = require('moment');
const fetch = require('node-fetch');

// get result from indexer
const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'explorer',
  host: '35.240.76.233',
  database: 'mainnet_explorer',
  password: 'H+848CGRqtqZ4vVd',
  port: 5432,
});

const getQueryResultFromIndexer = async (query) => {
  return await new Promise(function (resolve, reject) {
    pool.query(query, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results.rows);
      }
    });
  });
};

// store result into database

const storeResultIntoDatabase = async (result, queryId) => {
  let myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + process.env.UPDATE_TOKEN);
  myHeaders.append('Content-Type', 'application/json');

  let raw = JSON.stringify({
    result: result,
    executedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    queryId: queryId,
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  let res;

  fetch('localhost:3000/result', requestOptions)
    .then((response) => response.json())
    .then((result) => (res = result))
    .catch((error) => console.log('error', error));

  return res;
};

const updateResultFromDatabase = async (result, resultId, queryId) => {
  let myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + process.env.UPDATE_TOKEN);
  myHeaders.append('Content-Type', 'application/json');

  let raw = JSON.stringify({
    result: result,
    executedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    queryId: queryId,
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  let res;

  fetch('localhost:3000/result/' + resultId, requestOptions)
    .then((response) => response.json())
    .then((result) => (res = result))
    .catch((error) => console.log('error', error));

  return res;
};

exports.getQueryResultFromIndexer = getQueryResultFromIndexer;
exports.storeResultIntoDatabase = storeResultIntoDatabase;
exports.updateResultFromDatabase = updateResultFromDatabase;
