"use strict";

var mongoose = require( "mongoose" );
var Schema   = mongoose.Schema;

module.exports.get = function get() {
	return {
		id         : {
			type : String
		},
		name       : {
			type : String
		},
		apiKey     : {
			type : String
		},
		properties : {
			special : {
				type : String
			}
		},
		parent     : {
			type : Schema.Types.ObjectId,
			ref  : "person"
		}
	};
};

module.exports.construct = function construct( id, name, apiKey, special, parent ) {
	return {
		id         : id,
		name       : name,
		apiKey     : apiKey,
		properties : {
			special : special
		},
		parent     : parent
	};
};
