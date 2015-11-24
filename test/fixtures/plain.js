"use strict";

module.exports.get = function get() {
	return {
		id         : {},
		name       : {},
		apiKey     : {},
		properties : {
			special : {}
		}
	};
};

module.exports.construct = function construct( id, name, apiKey, special ) {
	return {
		id         : id,
		name       : name,
		apiKey     : apiKey,
		properties : {
			special : special
		}
	};
};
