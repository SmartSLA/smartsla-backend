'use strict';

module.exports = dependencies => {
  const mongoose = dependencies('db').mongo.mongoose;
  const User = mongoose.model('User');

  const publicKeys = [
    'firstname',
    'lastname',
    'preferredEmail',
    'emails',
    'domains',
    'avatars',
    'job_title',
    'service',
    'building_location',
    'office_location',
    'main_phone',
    'description',
    'role'
  ];

  return {
    denormalize,
    getId
  };

  function getId(user) {
    return user._id;
  }

  function denormalize(user) {
    const denormalizedUser = {
      role: user.role
    };

    user = user instanceof User ? user : new User(user).toObject({ virtuals: true });

    denormalizedUser.id = getId(user);
    publicKeys.forEach(key => {
      if (user[key]) {
        denormalizedUser[key] = user[key];
      }
    });

    return denormalizedUser;
  }
};
