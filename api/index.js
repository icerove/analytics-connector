const { Router } = require('express');
const { validationErrorHandler, adminCheck } = require('./error');
const { tokenRequired } = require('../lib/jwt');

const query = require('./query');
const result = require('./result');

const {
  getQueryResultFromIndexer,
  storeResultIntoDatabase,
  getQuery,
} = require('../utils');

const getAndStore = async (query, queryId) => {
  let query_result = await getQueryResultFromIndexer(query);
  query_result = JSON.stringify(query_result);
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

const getAndStoreResult = async (req, res) => {
  queryId = req.body.queryId;
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
      final = e;
      console.log('final error', e);
    }
  }
  res.json(final);
};

const getAndStoreResultWithAdmin = async (req, res) => {
  queryId = req.body.queryId;
  token = req.body.token;

  let admin = adminCheck(token);

  if (!queryId) {
    res.json('Query do not find');
  }
  let query, final;
  if (admin) {
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
        final = e;
        console.log('final error', e);
      }
    }
  } else {
    final = 'Not Admin';
  }

  res.json(final);
};

const router = new Router();
router.use('/query', query);
router.use('/result', result);
router.post('/store', tokenRequired, validationErrorHandler, getAndStoreResult);
router.post('/admin-store', validationErrorHandler, getAndStoreResultWithAdmin);

module.exports = router;
