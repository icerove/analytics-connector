const moment = require('moment');

const {
  getQueryResultFromIndexer,
  updateResultFromDatabase,
  getQuery,
  getResultList,
} = require('./utils');

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
  let resultList;
  try {
    res = await getResultList();
    resultList = res.rows;
  } catch (e) {
    console.log('update get result list error', e);
  }
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
  let query, query_result, final;
  try {
    query = await getQuery(queryId);
  } catch (e) {
    console.log('update get query error', e);
  }

  if (query) {
    try {
      query_result = await getQueryResultFromIndexer(query);
      query_result = JSON.stringify(query_result);
    } catch (e) {
      console.log('update get result from indexer error', e);
    }
  }

  if (query_result) {
    try {
      final = await updateResultFromDatabase(query_result, resultId, queryId);
    } catch (e) {
      final = e;
      console.log('update final error', e);
    }
  }

  return final;
};

main();
