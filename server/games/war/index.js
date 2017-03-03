const debug = require('debug')('cg:mw:games:war');
// const _ = require('lodash');

module.exports = function(packet, next) {
  debug(packet);
  next();
};
