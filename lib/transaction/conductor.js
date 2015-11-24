"use strict";

var TypeInfo   = require( "./../type/info.js" );
var websockets = require( "./websockets.js" );

/**
 * Conductor is THE tool to use when sending data to any type of client.
 * It makes sure every object is a plain object (not a mongoose model) and it sanitizes the object for the target user class.
 */

function Conductor() {
}

/**
 * Removes hidden properties from a payload and conceals concealed properties.
 * @param {*} recordToProcess The record to preprocess.
 * @param {*} recordType The module that contains type information about the record.
 * @param {String} userClass The user class for which the preprocessing should be performed.
 * @returns {*}
 */
Conductor.prototype.preProcess = function Conductor$preProcess( recordToProcess, recordType, userClass ) {
	if( Array.isArray( recordToProcess ) ) {
		var self = this;
		//noinspection UnnecessaryLocalVariableJS
		var payloadCollection = recordToProcess.map( function preProcess( record ) {
			return self.preProcess( record, recordType, userClass );
		} );
		return payloadCollection;
	}
	// If the record is a mongoose document, convert it to a plain object.
	if( recordToProcess && typeof ( recordToProcess.toObject ) === "function" ) {
		recordToProcess = recordToProcess.toObject();
	}
	// Remove properties that are null
	recordType.typehelper.omitNull( recordToProcess );
	// Remove hidden properties
	var payload = recordType.typehelper.omitHidden( recordToProcess, userClass, true );
	// Conceal properties
	recordType.typehelper.conceal( payload, userClass );

	return payload;
};

/**
 * Send a record over websockets to connected clients.
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 * @param {String} userClass The user class for which the preprocessing should be performed.
 */
Conductor.prototype.sendTo = function Conductor$sendTo( recordToSend, recordType, userClass ) {
	var payload        = this.preProcess( recordToSend, recordType, userClass );
	var payloadWrapper = {};

	if( Array.isArray( recordToSend ) ) {
		var collectionName = recordType.collection.name;
		// Wrap the payload in an object that has a property which is named after the records collection type.
		payloadWrapper[ collectionName ] = payload;
		websockets.emit( collectionName, payloadWrapper );

	} else {
		var typeName = recordType.typehelper.typeInfo.typeName;
		// Wrap the payload in an object that has a property which is named after the record type.
		payloadWrapper[ typeName ] = payload;
		websockets.emit( typeName, payloadWrapper );
	}
};

/**
 * Send a special payload that signals the deletion of an entity.
 * @param {*} recordToSend The record that was deleted.
 * @param {*} recordType The module that contains type information about the record.
 */
Conductor.prototype.sendDeletion = function Conductor$sendDeletion( recordToSend, recordType ) {
	var payload = {
		id : recordToSend.id
	};

	var typeName = recordType.typehelper.typeInfo.typeName;
	// Wrap the payload in an object that has a property which is named after the record type.
	var payloadWrapper         = {};
	payloadWrapper[ typeName ] = payload;
	websockets.emit( typeName, payloadWrapper );
};

/**
 * Respond to a request with a record.
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 * @param {String} userClass The user class for which the preprocessing should be performed.
 * @param {*} response The express response object to use for sending the response to the client.
 */
Conductor.prototype.respondTo = function Conductor$respondTo( recordToSend, recordType, userClass, response ) {
	var payload = this.preProcess( recordToSend, recordType, userClass );

	var typeName = recordType.typehelper.typeInfo.typeName;
	// Wrap the payload in an object that has a property which is named after the record type.
	var payloadWrapper         = {};
	payloadWrapper[ typeName ] = payload;
	response.json( payloadWrapper );
};

/**
 * Convenience function that implies broadcasting to users.
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 */
Conductor.prototype.sendToUsers = function Conductor$sendToUsers( recordToSend, recordType ) {
	this.sendTo( recordToSend, recordType, TypeInfo.USERCLASS_USER );
};

/**
 * DO NOT USE! Convenience function that implies broadcasting to admins.
 * If a connected websocket belongs to a certain user class can NOT be determined!
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 */
Conductor.prototype.sendToAdmins = function Conductor$sendToAdmins( recordToSend, recordType ) {
	throw new Error( "not supported" );
};

/**
 * Convenience function that implies responding to a user.
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 * @param {*} response The express response object to use for sending the response to the client.
 */
Conductor.prototype.respondToUser = function Conductor$respondToUser( recordToSend, recordType, response ) {
	this.respondTo( recordToSend, recordType, TypeInfo.USERCLASS_USER, response );
};

/**
 * Convenience function that implies responding to an admin.
 * @param {*} recordToSend The record that should be broadcast.
 * @param {*} recordType The module that contains type information about the record.
 * @param {*} response The express response object to use for sending the response to the client.
 */
Conductor.prototype.respondToAdmin = function Conductor$respondToAdmin( recordToSend, recordType, response ) {
	this.respondTo( recordToSend, recordType, TypeInfo.USERCLASS_ADMIN, response );
};

