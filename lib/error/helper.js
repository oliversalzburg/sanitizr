"use strict";

module.exports = HelperError;

function HelperError( message ) {
	this.message = message;
	this.name    = "HelperError";
	Error.captureStackTrace( this, HelperError );
}
HelperError.prototype             = Object.create( Error.prototype );
HelperError.prototype.constructor = HelperError;
