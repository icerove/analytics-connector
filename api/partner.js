const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'explorer',
  host: '35.240.76.233',
  database: 'mainnet_explorer',
  password: 'H+848CGRqtqZ4vVd',
  port: 5432,
});

const queryForPartnerTransactions = (timestamp, partner_list) => {
  return await new Promise(function (resolve, reject) {
    pool.query(
      `SELECT
    receiver_account_id,
    COUNT(*) AS transactions_count
  FROM transactions
  WHERE receiver_account_id IN (${partner_list})
  ${
    timestamp
      ? `AND TO_TIMESTAMP(block_timestamp/1000000000) > '${timestamp}'`
      : ''
  }
  GROUP BY receiver_account_id
  ORDER BY transactions_count DESC`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

const queryForPartnerUniqueUserAmount = (timestamp, partner_list) => {
  return await new Promise(function (resolve, reject) {
    pool.query(
      `SELECT
    receiver_account_id,
    COUNT(DISTINCT predecessor_account_id) AS user_amount
  FROM receipts
  WHERE receiver_account_id IN (${partner_list})
  ${
    timestamp
      ? `AND TO_TIMESTAMP(included_in_block_timestamp/1000000000) > '${timestamp}'`
      : ''
  }
  GROUP BY receiver_account_id
  ORDER BY user_amount DESC`,
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results.rows);
        }
      }
    );
  });
};

exports.queryForPartnerTransactions = queryForPartnerTransactions;
exports.queryForPartnerUniqueUserAmount = queryForPartnerUniqueUserAmount;
