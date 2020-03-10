module.exports = dependencies => {
  const { computeCns } = require('./cns');
  const { exportData } = require('./export-csv')(dependencies);

  return {
    computeCns,
    exportData
  };
};
