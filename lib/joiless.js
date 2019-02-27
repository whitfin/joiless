let isFunction = require('lodash.isfunction');
let isString = require('lodash.isstring');
let joi = require('joi');
let pc = require('pascal-case');

/* Public */

function attach(schema) {
	let attachments = {};

	schema
	&& schema._inner
	&& schema._inner.children
	&& schema._inner.children.forEach(function (child) {
		attachments[pc(child.key)] = {
			get: function () {
				return child.schema;
			}
		};
	});

	return Object.defineProperties(schema, attachments);
}

function extend(spec, extension) {
	return _apply(spec, extension);
}

function spec(type, params) {
	let after, local;

	if (!params) {
		if (isString(type)) {
			params = {};
		} else {
			params = type || {};
			type = params.type;
			delete params.type;
		}
	}

	if (isFunction(params.after)) {
		after = params.after;
		delete params.after;
	}

	local = joi[type]();
	local = _apply(local, params);
	local = after ? after(local) : local;

	return local;
}

/* Exports */

module.exports.attach = attach;
module.exports.extend = extend;
module.exports.spec = spec;

/* Private */

function _apply(spec, params) {
	let local = spec;

	Object.keys(params).forEach(function (key) {
		local = Array.isArray(params[key])
			? local[key].apply(local, params[key])
			: local[key](params[key]);
	});

	return local;
}
