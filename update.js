const moment = require('moment');
const fetch = require('node-fetch');

const {
  getQueryResultFromIndexer,
  updateResultFromDatabase,
} = require('./api/result');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('update every 3 hrs');
  while (true) {
    let start_time = new Date();
    while (true) {
      try {
        await updateResult();
        break;
      } catch (e) {
        console.error('error to updateResult: ');
        console.error(e);
        console.error('retrying in 1 min');
        await sleep(60000);
        continue;
      }
    }
    let finish_time = new Date();
    console.log(start_time, finish_time);
    let executed_time = moment(finish_time).diff(start_time);
    let wait_time =
      executed_time > 3 * 60 * 60000
        ? executed_time
        : 3 * 60 * 60000 - executed_time;
    await sleep(wait_time);
  }
}

async function updateResult() {
  requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  let resultList;
  fetch('localhost:3000/result/list', requestOptions)
    .then((response) => response.json())
    .then((result) => {
      resultList = result;
    })
    .catch((error) => {
      console.log('error', error);
    });
  if (resultList) {
    for (let i = 0; i < resultList.length; i++) {
      final = await getAndUpdateResult(
        resultList[i].result_id,
        resultList[i].query_id
      );
      console.log(final);
    }
  }
}

const getAndUpdateResult = async (resultId, queryId) => {
  requestOptions = {
    method: 'GET',
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
    final = await updateResultFromDatabase(query_result, resultId, queryId);
  } else {
    final = 'query result cannot reach';
  }
  return final;
};

main();
