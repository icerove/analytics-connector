const { Router } = require('express');
const { validationErrorHandler } = require('./error');

const query = require('./query');
const result = require('./result');

const {
  getQueryResultFromIndexer,
  storeResultIntoDatabase,
  getQuery,
} = require('../utils');

const getAndStoreResult = async (req, res) => {
  queryId = req.body.queryId;
  console.log('come here');
  if (!queryId) {
    res.json('Query do not find');
  }
  let query, final;

  try {
    query = await getQuery(queryId);
    console.log('query', query);
  } catch (e) {
    console.log('error', e);
  }

  if (query) {
    try {
      final = await getAndStore(query, queryId);
      console.log('final', final);
    } catch (e) {
      console.log('final error', e);
    }
  }
  res.json(final);
};

const getAndStore = async (query, queryId) => {
  let query_result = await getQueryResultFromIndexer(query);
  query_result = JSON.stringify(query_result);
  console.log('query_result', query_result);
  let final;
  if (query_result) {
    try {
      final = await storeResultIntoDatabase(query_result, queryId);
    } catch (e) {
      final = e;
    }
  } else {
    final = 'query result cannot reach';
  }
  return final;
};

const router = new Router();
router.use('/query', query);
router.use('/result', result);
router.post('/store', validationErrorHandler, getAndStoreResult);

module.exports = router;
