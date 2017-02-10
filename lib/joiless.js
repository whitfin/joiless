var isFunction = require('lodash.isfunction');
var joi = require('joi');
var pc = require('pascal-case');

/* Public */

function attach(schema) {
  var attachments = {};

  schema && schema._inner && schema._inner.children.forEach(function (child) {
    attachments[pc(child.key)] = {
      get: function () {
        return child.schema;
      }
    };
  });

  return Object.defineProperties(schema, attachments);
}

function spec(type, params) {
  var after, spec;

  if (arguments.length === 1) {
    params = type;
    type = params.type;
    delete params.type;
  }

  if (isFunction(params.after)) {
    after = params.after;
    delete params.after;
  }

  spec = joi[type]();

  Object.keys(params).forEach(function (key) {
    spec = Array.isArray(params[key])
      ? spec[key].apply(spec, params[key])
      : spec[key](params[key]);
  });

  if (after) {
    after(spec);
  }

  return spec;
}

/* Exports */

module.exports.attach = attach;
module.exports.spec = spec;
