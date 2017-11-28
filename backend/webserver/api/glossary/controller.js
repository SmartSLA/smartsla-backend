'use strict';

module.exports = function(dependencies, lib) {
  const { send500Error } = require('../utils')(dependencies);

  return {
    create,
    list
  };

  /**
   * Create a glossary.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function create(req, res) {
    return lib.glossary.create(req.body)
      .then(glossary => res.status(201).json(glossary))
      .catch(err => send500Error(`Failed to create ${req.body.catetory}`, err, res));
  }

  /**
   * List glossaries.
   *
   * @param {Request} req
   * @param {Response} res
   */
  function list(req, res) {
    const { category } = req.query;

    return lib.glossary.list({ category })
      .then(glossaries => {
        res.header('X-ESN-Items-Count', glossaries.length);
        res.status(200).json(glossaries);
      })
      .catch(err => send500Error('Failed to list glossaries', err, res));
  }
};
