const { Router } = require('express');
const { validationErrorHandler } = require('./error');
const {
  getQueryResultFromIndexer,
  storeResultIntoDatabase,
  getQuery,
} = require('../utils');

const getAndStoreResult = async (req, res) => {
  queryId = req.body.queryId;
  if (!queryId) {
    res.json('Query do not exits');
  }
  let query, final;

  try {
    query = await getQuery(queryId);
  } catch (e) {
    console.log('error', e);
  }

  if (query) {
    try {
      final = await getAndStore(query, queryId);
    } catch (e) {
      console.log('final error', e);
    }
  }
  res.json(final);
};

const getAndStore = async (query, queryId) => {
  query_result = await getQueryResultFromIndexer(query);
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
router.post('/', validationErrorHandler, getAndStoreResult);

module.exports = router;
