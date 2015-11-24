"use strict";

var Server = require( "socket.io" );

module.exports = new WebSocketLibrary();

function WebSocketLibrary() {
}

WebSocketLibrary.prototype.configure = function WebSocketLibrary$configure( configuration ) {
	// Did we receive a socket.io instance?
	if( configuration instanceof Server ) {
		this.io = configuration;
		return;

	} else if( configuration.constructor.name == "Server" ) {
		throw new Error(
			"configuration is an instance of 'Server', but wasn't detected as socket.io instance. This indicates a possible socket.io version conflict between your application and absync! absync will probably not work." );
	}

	// Is the configuration just a port number?
	if( typeof configuration == "number" ) {
		this.io = require( "socket.io" )( configuration );
		return;
	}

	// Is it a configuration hash?
	if( typeof configuration == "object" ) {
		this.io = require( "socket.io" )( configuration.port );
		//noinspection UnnecessaryReturnStatementJS
		return;
	}
};

WebSocketLibrary.prototype.emit = function WebSocketLibrary$emit( name, payload ) {
	if( null !== this.io ) {
		//noinspection JSUnresolvedVariable
		this.io.sockets.emit( name, payload );

	} else {
		throw new Error( "Websocket transport has no socket.io configured. emit() has no effect." );
	}
};

