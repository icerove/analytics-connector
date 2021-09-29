const moment = require('moment');
const { pool, sql } = require('./db');

// get result from indexer
const IPool = require('pg').Pool;
const ipool = new IPool({
  user: process.env.INDEXER_USER,
  host: process.env.INDEXER_HOST,
  database: process.env.INDEXER_DATABASE,
  password: process.env.INDEXER_PASSWORD,
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
const updateResultFromDatabase = async (result, resultId, queryId) => {
  let executedAt = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
  let res;
  try {
    res = await pool.query(
      sql.updateResult({ result, executedAt, queryId, resultId })
    );
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
