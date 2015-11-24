"use strict";

var EventEmitter = require( "events" ).EventEmitter;
var util         = require( "util" );

module.exports = Type;

/**
 * Contains all the important aspects regarding a type.
 * @param {Object} schema The schema that was used to construct the type.
 * @param {TypeInfo} typeinfo The type information container.
 * @param {mongoose.Model} model The mongoose model.
 * @param {mongoose.Collection} collection The mongoose collection.
 * @constructor
 */
function Type( schema, typeinfo, model, collection ) {
	var TypeHelper = require( "./helper" );

	this.schema = schema;
	/** @type TypeInfo */
	this.typeinfo = typeinfo;
	/** @type TypeHelper */
	this.typehelper = new TypeHelper( this.typeinfo );
	this.model      = model;
	this.collection = collection;
	//noinspection JSUnusedGlobalSymbols
}

util.inherits( Type, EventEmitter );

/**
 *
 * @param {TypeInfo} typeInfo
 * @returns {Type}
 */
Type.for = function Type$for( typeInfo ) {
	var type = new Type( undefined,
		typeInfo,
		undefined,
		undefined );

	return type;
};
