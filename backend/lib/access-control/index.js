'use strict';

const policies = require('./policies');

class AccessControl {
  constructor() {
    this.policies = this._flattenPolicies(policies);
  }

  can(role, resourceType, operation, options = {}) {
    if (!this.policies[role]) {
      return false;
    }

    const policy = this.policies[role];
    const action = `${operation}_${resourceType}`;

    if (policy.can[action]) {
      if (typeof policy.can[action] !== 'function') {
        return true;
      }

      return policy.can[action](options);
    }

    return false;
  }

  _flattenPolicies(policies) { // eslint-disable-line class-methods-use-this
    const result = {};

    Object.keys(policies).forEach(role => {
      result[role] = { can: {} };
      Object.keys(policies[role].can).forEach(resourceType => {
        policies[role].can[resourceType].forEach(operation => {
          if (typeof operation === 'string') {
            result[role].can[`${operation}_${resourceType}`] = true;
          } else if (typeof operation.name === 'string' && typeof operation.when === 'function') {
            result[role].can[`${operation.name}_${resourceType}`] = operation.when;
          }
        });
      });
    });

    return result;
  }
}

module.exports = AccessControl;
