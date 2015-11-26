"use strict";

module.exports = DecoratorError;

function DecoratorError( message ) {
	this.message = message;
	this.name    = "DecoratorError";
	Error.captureStackTrace( this, DecoratorError );
}
DecoratorError.prototype             = Object.create( Error.prototype );
DecoratorError.prototype.constructor = DecoratorError;
