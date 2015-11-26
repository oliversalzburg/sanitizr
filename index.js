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

function decorate( type ) {
	return new TypeDecorator( type );
}

function info( typeName, type ) {
	return new TypeInfo( typeName, type );
}

function helper( typeInfo ) {
	return new TypeHelper( typeInfo );
}

module.exports.USERCLASS_ADMIN = TypeInfo.USERCLASS_ADMIN;
module.exports.USERCLASS_USER  = TypeInfo.USERCLASS_USER;

module.exports.CONCEALED = TypeInfo.CONCEALED;
module.exports.HIDDEN    = TypeInfo.HIDDEN;
module.exports.READ_ONLY = TypeInfo.READ_ONLY;
