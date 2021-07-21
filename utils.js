const moment = require('moment');
const { pool, sql } = require('./db');

// get result from indexer
const IPool = require('pg').Pool;
const ipool = new IPool({
  user: 'explorer',
  host: '35.240.76.233',
  database: 'mainnet_explorer',
  password: 'H+848CGRqtqZ4vVd',
  port: 5432,
});

const getQueryResultFromIndexer = async (query) => {
  return await new Promise(function (resolve, reject) {
    ipool.query(query, (error, results) => {
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
  let executedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  console.log(executedAt);
  let res;
  try {
    total_res = await pool.query(
      sql.createResult({ result, executedAt, queryId })
    );
    res = total_res.rows[0];
  } catch (e) {
    res = e;
  }

  return res;
};

// update result into database
const updateResultFromDatabase = async (result, resultId) => {
  let executedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  let res;
  try {
    res = await pool.query(sql.updateResult({ result, executedAt, resultId }));
  } catch (e) {
    res = e;
  }

  return res;
};

// get query
const getQuery = async (queryId) => {
  let query;
  try {
    result = await pool.query(sql.getQuery({ queryId }));
    query = result.rows[0].query;
  } catch (e) {
    console.log('get query error', e);
  }
  return query;
};

// get result list
const getResultList = async () => {
  let resultList;
  try {
    resultList = await pool.query(sql.getResultList());
  } catch (e) {
    console.log('get result list error', e);
  }
  return resultList;
};

exports.getQueryResultFromIndexer = getQueryResultFromIndexer;
exports.storeResultIntoDatabase = storeResultIntoDatabase;
exports.updateResultFromDatabase = updateResultFromDatabase;
exports.getQuery = getQuery;
exports.getResultList = getResultList;
