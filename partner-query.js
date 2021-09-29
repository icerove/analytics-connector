// query part
const queryTransactions = (accountId, timestamp = undefined) => {
  return `SELECT
    receiver_account_id,
    COUNT(*) AS transactions_count
  FROM transactions
  WHERE receiver_account_id = '${accountId}'
  ${
    timestamp
      ? `AND block_timestamp >= (cast(EXTRACT(EPOCH FROM NOW()) - 60 * 60 * 24 * ${timestamp} AS bigint) * 1000 * 1000 * 1000)`
      : ''
  } GROUP BY receiver_account_id`;
};

const queryUniqueUserAmount = (accountId, timestamp = undefined) => {
  return `SELECT
    receiver_account_id,
    COUNT(DISTINCT predecessor_account_id) AS user_amount
  FROM receipts
  WHERE receiver_account_id = '${accountId}'
  ${
    timestamp
      ? `AND included_in_block_timestamp >= (cast(EXTRACT(EPOCH FROM NOW()) - 60 * 60 * 24 * ${timestamp} AS bigint) * 1000 * 1000 * 1000)`
      : ''
  } GROUP BY receiver_account_id`;
};

const queryTokenValueTransacted = (accountId, timestamp = undefined) => {
  return `SELECT
      receipt_receiver_account_id as receiver_account_id,
      SUM((args->>'deposit')::numeric) AS token_value
    FROM action_receipt_actions 
    JOIN execution_outcomes ON execution_outcomes.receipt_id = action_receipt_actions.receipt_id
    WHERE receipt_predecessor_account_id != 'system'
    AND action_kind IN ('FUNCTION_CALL', 'TRANSFER')
    AND execution_outcomes.status IN ('SUCCESS_VALUE', 'SUCCESS_RECEIPT_ID')
    AND  receipt_receiver_account_id = '${accountId}'
  ${
    timestamp
      ? `AND receipt_included_in_block_timestamp >= (cast(EXTRACT(EPOCH FROM NOW()) - 60 * 60 * 24 * ${timestamp} AS bigint) * 1000 * 1000 * 1000)`
      : ''
  }GROUP BY receipt_receiver_account_id`;
};

exports.queryTransactions = queryTransactions;
exports.queryUniqueUserAmount = queryUniqueUserAmount;
exports.queryTokenValueTransacted = queryTokenValueTransacted;
