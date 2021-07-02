const { Router } = require('express');
const { validationErrorHandler } = require('./error');

const router = new Router();

const getResult = async (req, res) => {
  resultId = req.body.resultId;
  if (!resultId) {
    res.json('Query do not exits');
  }
  requestOptions = {
    method: 'POST',
    redirect: 'follow',
  };

  let show_res;
  fetch('localhost:3000/result/' + resultId, requestOptions)
    .then((response) => response.json())
    .then((result) => (show_res = result))
    .catch((error) => console.log('error', error));

  res.json(show_res);
};

router.post('/', validationErrorHandler, getResult);

module.exports = router;
