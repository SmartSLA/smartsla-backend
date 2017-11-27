'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const TicketingGlossary = mongoose.model('TicketingGlossary');

  return {
    create,
    list,
    glossaryExists
  };

  /**
   * Create new glossary.
   * @param  {Object} glossary - Glossary object
   * @return {Promise}         - Resolve with created glossary on success
   */
  function create(glossary) {
    glossary = glossary instanceof TicketingGlossary ? glossary : new TicketingGlossary(glossary);

    return TicketingGlossary.create(glossary);
  }

  /**
   * List glossaries.
   * @param {Object}   options - The options object, may contain category
   * @param {Promise}          - Resolve with list of glossary in alphabetic order
   */
  function list(options = {}) {
    const conditions = options.category ? { category: options.category } : {};

    return TicketingGlossary
      .find(conditions)
      .sort('word')
      .exec();
  }

  /**
   * Check if glossary already exists.
   * @param {Object}  glossary       - Glossary object
   * @param {Promise}                - Resolve true if glossary already exists, false otherwise
   */
  function glossaryExists(glossary) {
    return TicketingGlossary.count(glossary).exec()
      .then(count => count > 0);
  }
};
