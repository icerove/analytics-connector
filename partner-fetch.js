const {
  queryTokenValueTransacted,
  queryTransactions,
  queryUniqueUserAmount,
} = require('./partner-query');

const raw = (title, query) => ({
  title,
  query,
});

let transaction_total = (accountId) =>
  raw('transaction_total', queryTransactions(accountId));

let transaction_30d = (accountId) =>
  raw('transaction_30d', queryTransactions(accountId, 30));

let transaction_7d = (accountId) =>
  raw('transaction_7d', queryTransactions(accountId, 7));

let transaction_24h = (accountId) =>
  raw('transaction_24h', queryTransactions(accountId, 1));

let transaction_12h = (accountId) =>
  raw('transaction_12h', queryTransactions(accountId, 0.5));

let users_total = (accountId) =>
  raw('users_total', queryUniqueUserAmount(accountId));
let users_30d = (accountId) =>
  raw('users_30d', queryUniqueUserAmount(accountId, 30));
let users_7d = (accountId) =>
  raw('users_7d', queryUniqueUserAmount(accountId, 7));
let users_24h = (accountId) =>
  raw('users_24h', queryUniqueUserAmount(accountId, 1));

let tokenvalue_total = (accountId) =>
  raw('tokenvalue_total', queryTokenValueTransacted(accountId));

let tokenvalue_30d = (accountId) =>
  raw('tokenvalue_30d', queryTokenValueTransacted(accountId, 30));

let tokenvalue_7d = (accountId) =>
  raw('tokenvalue_7d', queryTokenValueTransacted(accountId, 7));

let tokenvalue_24h = (accountId) =>
  raw('tokenvalue_24h', queryTokenValueTransacted(accountId, 1));

export const request = {
  transaction_total,
  transaction_30d,
  transaction_7d,
  transaction_24h,
  transaction_12h,
  users_total,
  users_30d,
  users_7d,
  users_24h,
  tokenvalue_total,
  tokenvalue_30d,
  tokenvalue_7d,
  tokenvalue_24h,
};
