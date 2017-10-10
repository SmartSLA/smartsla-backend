'use strict';

// arguments: dependencies, lib
module.exports = function() {
  return {
    example
  };

  function example(req, res) {
    return res.status(200).json({ message: 'controller example' });
  }
};
