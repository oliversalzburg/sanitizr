"use strict";

var sql = require( "sql" ).setDialect( "postgres" );

module.exports.get = function get() {
	return sql.define( {
		name    : "person",
		columns : [
			"id",
			"name",
			"apiKey",
			"properties.special"
		]
	} );
};
