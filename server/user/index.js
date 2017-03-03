const debug = require('debug')('cg:mw:user:index');

module.exports = function(client, next) {
  client.on('name::change', name => {
    debug(client.id, 'wants to change name to', name);
    let isValid = /^[a-zA-Z0-9 ]{3,20}$/.test(name);
    let isDifferent = client.name !== name;
    if (isValid && isDifferent) {
      let oldName = (client.name) ? client.name : client.id;
      client.name = name;
      debug(oldName, 'changed name to', client.name);
    }
  });
  next();
};
