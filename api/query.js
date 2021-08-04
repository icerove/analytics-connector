const { Router } = require('express');
const { body } = require('express-validator');

const { validationErrorHandler, adminCheck } = require('./error');
const { pool, sql } = require('../db');

const createQueryValidator = body('content').trim();

const createQuery = async (req, res) => {
  queryName = req.body.query_name;
  query = req.body.query;
  options = req.body.options;
  formatting = req.body.formatting;
  createTime = req.body.create_time;
  userId = 0;
  token = req.body.token;

  let admin = adminCheck(token);

  if (admin) {
    result = await pool.query(
      sql.createQuery({
        queryName,
        query,
        options,
        formatting,
        createTime,
        userId,
      })
    );
    res.status(201).json(result.rows[0]);
  } else {
    res.json('Not Admin');
  }
};

const updateQuery = async (req, res) => {
  queryName = req.body.query_name;
  query = req.body.query;
  options = req.body.options;
  formatting = req.body.formatting;
  createTime = req.body.create_time;
  userId = 0;
  token = req.body.token;

  queryId = req.params.id;

  let admin = adminCheck(token);
  if (admin) {
    await pool.query(
      sql.updateQuery({
        queryName,
        query,
        options,
        formatting,
        createTime,
        userId,
        queryId,
      })
    );
    res.json('Query is updated');
  } else {
    res.json('Not Admin');
  }
};

const deleteQuery = async (req, res) => {
  token = req.body.token;
  queryId = req.params.id;

  let admin = adminCheck(token);
  if (admin) {
    await pool.query(sql.deleteQuery({ queryId }));
    res.json('Query is deleted');
  } else {
    res.json('Not Admin');
  }
};

const getQuery = async (req, res) => {
  queryId = req.params.id;

  if (queryId === null) {
    return res.status(200).json('Query is not found');
  }

  result = await pool.query(sql.getQuery({ queryId }));
  res.json(result.rows[0]);
};

const router = new Router();
router.post('/', createQueryValidator, validationErrorHandler, createQuery);
router.post('/:id', createQueryValidator, validationErrorHandler, updateQuery);
router.delete('/:id', validationErrorHandler, deleteQuery);
router.get('/:id', validationErrorHandler, getQuery);

module.exports = router;
