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
