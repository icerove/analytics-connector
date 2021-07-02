const { Router } = require('express');
const { validationErrorHandler } = require('./error');
const {
  getQueryResultFromIndexer,
  storeResultIntoDatabase,
} = require('./result');
const router = new Router();
const fetch = require('node-fetch');

const getAndStoreResult = async (req, res) => {
  queryId = req.body.queryId;
  if (!queryId) {
    res.json('Query do not exits');
  }
  requestOptions = {
    method: 'POST',
    redirect: 'follow',
  };

  let query, final, query_result;
  fetch('localhost:3000/query/' + queryId, requestOptions)
    .then((response) => response.json())
    .then((result) => (query = result.query))
    .catch((error) => console.log('error', error));
  if (query) {
    query_result = await getQueryResultFromIndexer(query);
  }
  if (query_result) {
    final = await storeResultIntoDatabase(query_result, queryId);
  } else {
    final = 'query result cannot reach';
  }

  res.json(final);
};

router.post('/', validationErrorHandler, getAndStoreResult);

module.exports = router;
