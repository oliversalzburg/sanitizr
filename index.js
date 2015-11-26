"use strict";

var TypeDecorator = require( "./lib/type/decorator" );
var TypeHelper    = require( "./lib/type/helper" );
var TypeInfo      = require( "./lib/type/info" );

module.exports = {
	DecoratorError : require( "./lib/error/decorator" ),
	HelperError    : require( "./lib/error/helper" ),
	InfoError      : require( "./lib/error/info" ),

	ChangeSet : require( "./lib/history/changeset" ),

	Conductor  : require( "./lib/transaction/conductor" ),
	WebSockets : require( "./lib/transaction/websockets" ),

	TypeDecorator : TypeDecorator,
	Factory       : require( "./lib/type/factory" ),
	TypeHelper    : TypeHelper,
	TypeInfo      : TypeInfo,
	Type          : require( "./lib/type/type" ),

	decorate : decorate,
	info     : info,
	helper   : helper
};

/**
 * Start decorating a type.
 * @param {Object} type The type to decorate.
 * @returns {TypeDecorator}
 */
function decorate( type ) {
	return new TypeDecorator( type );
}

/**
 * Register the type information for a type.
 * @param {String} typeName The name for the type.
 * @param {Object} type The type itself.
 * @returns {TypeInfo}
 */
function info( typeName, type ) {
	return new TypeInfo( typeName, type );
}

/**
 * Retrieve the type helper for a type.
 * @param {TypeInfo} typeInfo The type information object.
 * @returns {TypeHelper}
 */
function helper( typeInfo ) {
	return new TypeHelper( typeInfo );
}

module.exports.USERCLASS_ADMIN = TypeInfo.USERCLASS_ADMIN;
module.exports.USERCLASS_USER  = TypeInfo.USERCLASS_USER;

module.exports.CONCEALED = TypeInfo.CONCEALED;
module.exports.HIDDEN    = TypeInfo.HIDDEN;
module.exports.READ_ONLY = TypeInfo.READ_ONLY;
