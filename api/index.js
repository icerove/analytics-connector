const { Router } = require('express')
const {getQueryResultFromIndexer} = require('./result')
const { validationErrorHandler } = require('./error')

const router = new Router()

const getResult = async (req, res) => {
  query = req.body.query
  result = await getQueryResultFromIndexer(query)
  res.json(result)
}

router.post('/',validationErrorHandler, getResult)

module.exports = router
