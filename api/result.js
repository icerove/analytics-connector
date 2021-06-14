const Pool = require('pg').Pool
const pool = new Pool({
  user: 'explorer',
  host: '35.240.76.233',
  database: 'mainnet_explorer',
  password: 'H+848CGRqtqZ4vVd',
  port: 5432,
});

const getQueryResultFromIndexer = async (query) => {
  return await new Promise(function(resolve, reject) {
    pool.query(query, (error, results) => {
        if (error) {
          reject(error)
        }else {
          resolve(results.rows);
        }
      })
  }) 
}

exports.getQueryResultFromIndexer = getQueryResultFromIndexer
