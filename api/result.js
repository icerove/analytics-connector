const { Router } = require('express');
const { body } = require('express-validator');

const { validationErrorHandler, adminCheck } = require('./error');
const { pool, sql } = require('../db');

const createResultValidator = body('content').trim();

const createResult = async (req, res) => {
  result = req.body.result;
  executedAt = req.body.executedAt;
  queryId = req.body.queryId;
  token = req.body.token;

  admin = adminCheck(token);

  if (admin) {
    result = await pool.query(
      sql.createResult({ result, executedAt, queryId })
    );
    res.status(201).json(result.rows[0]);
  } else {
    res.json('Not Admin');
  }
};

const updateResult = async (req, res) => {
  result = req.body.result;
  resultId = req.params.id;
  executedAt = req.body.executedAt;
  queryId = req.body.queryId;

  token = req.body.token;

  admin = adminCheck(token);

  if (admin) {
    await pool.query(
      sql.updateResult({ result, executedAt, queryId, resultId })
    );
    res.json('Result is updated');
  } else {
    res.json('Not Admin');
  }
};

const deleteResult = async (req, res) => {
  token = req.body.token;
  resultId = req.params.id;

  admin = adminCheck(token);

  if (admin) {
    await pool.query(sql.deleteResult({ resultId }));
    res.json('Result is deleted');
  } else {
    res.json('Not Admin');
  }
};

const getResult = async (req, res) => {
  resultId = req.params.id;

  if (resultId === null) {
    return res.status(200).json('Result is not found');
  }

  result = await pool.query(sql.getResult({ resultId }));
  res.json(result.rows[0]);
};

const getResultList = async (req, res) => {
  result = await pool.query(sql.getResultList());
  res.json(result.rows);
};

const router = new Router();
router.post('/', createResultValidator, validationErrorHandler, createResult);
router.post(
  '/:id',
  createResultValidator,
  validationErrorHandler,
  updateResult
);
router.delete('/:id', validationErrorHandler, deleteResult);
router.get('/:id', validationErrorHandler, getResult);
router.get('/', validationErrorHandler, getResultList);

module.exports = router;
