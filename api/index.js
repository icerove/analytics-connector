const { Router } = require('express');
const { getQueryResultFromIndexer } = require('./result');
const { validationErrorHandler } = require('./error');
const {
  queryForPartnerTransactions,
  queryForPartnerUniqueUserAmount,
} = require('./partner');

const router = new Router();

const getResult = async (req, res) => {
  query = req.body.query;
  result = await getQueryResultFromIndexer(query);
  res.json(result);
};

const getResultForPartnerTransaction = async (req, res) => {
  (timestamp = req.body.timestamp), (partner_list = req.body.partner_list);
  result = await queryForPartnerTransactions(timestamp, partner_list);
  res.json(result);
};

const getResultForPartnerUser = async (req, res) => {
  (timestamp = req.body.timestamp), (partner_list = req.body.partner_list);
  result = await queryForPartnerUniqueUserAmount(timestamp, partner_list);
  res.json(result);
};

router.post('/', validationErrorHandler, getResult);
router.post(
  '/partner-transaction',
  validationErrorHandler,
  getResultForPartnerTransaction
);
router.post('/partner-user', validationErrorHandler, getResultForPartnerUser);

module.exports = router;
