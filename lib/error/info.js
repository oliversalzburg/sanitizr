"use strict";

module.exports = InfoError;

function InfoError( message ) {
	this.message = message;
	this.name    = "InfoError";
	Error.captureStackTrace( this, InfoError );
}
InfoError.prototype             = Object.create( Error.prototype );
InfoError.prototype.constructor = InfoError;
