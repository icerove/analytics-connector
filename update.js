const moment = require('moment');
const {
  getQueryResultFromIndexer,
  storeResultIntoDatabase,
} = require('./api/result');

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  console.log('update every 3 hrs');
  while (true) {
    let start_time = new Date();
    console.log(start_time);
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
    console.log(finish_time);
    let executed_time = moment(finish_time).diff(start_time);
    let wait_time =
      executed_time > 3 * 60 * 60000
        ? executed_time
        : 3 * 60 * 60000 - executed_time;
    await sleep(wait_time);
  }
}

async function updateResult() {
  let myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  let requestOptions = {
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
      await getandStoreResult(resultList[i].query_id);
    }
  }
}

const getandStoreResult = async (queryId) => {
  requestOptions = {
    method: 'GET',
    redirect: 'follow',
  };

  let query;
  fetch('localhost:3000/query/' + queryId, requestOptions)
    .then((response) => response.json())
    .then((result) => (query = result.query))
    .catch((error) => console.log('error', error));

  query_result = await getQueryResultFromIndexer(query);
  if (query_result) {
    final = await storeResultIntoDatabase(query_result, queryId);
  }
};

main();
