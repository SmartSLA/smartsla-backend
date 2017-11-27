'use strict';

module.exports = (dependencies, lib) => {
  const { requireAdministrator } = require('../helpers')(dependencies, lib);
  const { send400Error, send500Error } = require('../utils')(dependencies);

  return {
    canListGlossary,
    canCreateGlossary,
    validateGlossaryCreation
  };

  function canListGlossary(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function canCreateGlossary(req, res, next) {
    return requireAdministrator(req, res, next);
  }

  function validateGlossaryCreation(req, res, next) {
    const {
      word,
      category
    } = req.body;

    if (!word) {
      return send400Error('word is required', res);
    }

    if (!category) {
      return send400Error('category is required', res);
    }

    if (!lib.helpers.validateGlossaryCategory(category)) {
      return send400Error('category is not supported', res);
    }

    lib.glossary.glossaryExists({ word, category })
      .then(alreadyExists => {
        if (alreadyExists) {
          return send400Error(`${word} in ${category} already exists`, res);
        }

        next();
      })
      .catch(err => send500Error('Unable to check glossary', err, res));
  }
};
