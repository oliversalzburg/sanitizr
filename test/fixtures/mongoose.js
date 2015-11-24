"use strict";

module.exports.get = function get() {
	return {
		id         : String,
		name       : String,
		apiKey     : String,
		properties : {
			special : String
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
