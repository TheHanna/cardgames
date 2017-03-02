const _ = require('lodash');

function validName(data, next) {
  let name;
  let isValid = /^[a-zA-Z0-9 ]{3,20}$/;
  if (_.isArray(data)) {
    name = data[1];
  } else if (_.isObject(data)) {
    name = data.handshake.query.name;
  }
  if (name && isValid.test(name)) {
    next();
  }
}

module.exports = validName;
