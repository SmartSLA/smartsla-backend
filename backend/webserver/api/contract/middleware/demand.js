'use strict';

const composableMw = require('composable-middleware');
const _ = require('lodash');

module.exports = (dependencies, lib) => {
  const GLOSSARY_CATEGORIES = lib.constants.GLOSSARY_CATEGORIES;
  const {
    send400Error,
    send500Error
  } = require('../../utils')(dependencies);

  return {
    validateDemand
  };

  function validateDemand(req, res, next) {
    const { demandType } = req.body;

    if (!demandType) {
      return send400Error('Demand type is required', res);
    }

    const middlewares = [
      checkGlossariesAvailable,
      checkDemandExist
    ];

    return composableMw(middlewares)(req, res, next);
  }

  function checkGlossariesAvailable(req, res, next) {
    const {
      demandType,
      softwareType,
      issueType
    } = req.body;

    const glossaries = [{
      word: demandType,
      category: GLOSSARY_CATEGORIES.demandType
    }];

    if (softwareType) {
      glossaries.push({
        word: softwareType,
        category: GLOSSARY_CATEGORIES.softwareType
      });
    }

    if (issueType) {
      glossaries.push({
        word: issueType,
        category: GLOSSARY_CATEGORIES.issueType
      });
    }

    lib.glossary.findByGlossaries(glossaries)
      .then(foundGlossaries => {
        if (foundGlossaries.length === glossaries.length) {
          return next();
        }

        let notExistGlossaryCategories = glossaries.map(glossary => {
          if (!_.find(foundGlossaries, glossary)) {
            return glossary.category;
          }
        }).filter(Boolean);
        let message;

        if (notExistGlossaryCategories.length === 1) {
          message = `${notExistGlossaryCategories[0]} is unavailable`;
        } else {
          notExistGlossaryCategories = notExistGlossaryCategories.join(', ');
          message = `${notExistGlossaryCategories} are unavailable`;
        }

        return send400Error(message, res);
      })
      .catch(err => send500Error('Unable to check demand', err, res));
  }

  function checkDemandExist(req, res, next) {
    const demands = [...req.contract.demands, req.body];

    if (!lib.helpers.uniqueDemands(demands)) {
      return send400Error('Demand already exists', res);
    }

    next();
  }
};
