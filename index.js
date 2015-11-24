"use strict";

var TypeDecorator = require( "./lib/type/decorator" );
var TypeHelper    = require( "./lib/type/helper" );
var TypeInfo      = require( "./lib/type/info" );

module.exports = {
	DecoratorError : require( "./lib/error/decorator" ),
	HelperError    : require( "./lib/error/helper" ),

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
