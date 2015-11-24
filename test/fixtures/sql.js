"use strict";

var sql = require( "sql" ).setDialect( "postgres" );

module.exports.get = function get() {
	return sql.define( {
		name    : "person",
		columns : [
			"id",
			"name",
			"apiKey",
			"properties.special",
			"parent"
		]
	} );
};

module.exports.construct = function construct( id, name, apiKey, special, parent ) {
	return {
		id                   : id,
		name                 : name,
		apiKey               : apiKey,
		"properties.special" : special,
		parent               : parent
	};
};
