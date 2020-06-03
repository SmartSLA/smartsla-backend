'use strict';

module.exports = {
  populateFilteryQueryTemplate,
  parseQuery
};

function populateFilteryQueryTemplate(query, params) {
  let queryString = JSON.stringify(query);

  params.map(param => {
    queryString = queryString.replace(`%${param.key}%`, param.value);
  });

  return JSON.parse(queryString);
}

function parseQuery(query) {
  const queryString = JSON.stringify(query);

  return (queryString.match(/%.*?%/g) || []).map(x => x.replace(/[%%]/g, ''));
}
