"use strict";

var EventEmitter = require( "events" ).EventEmitter;
var TypeHelper   = require( "./helper" );
var util         = require( "util" );

/**
 * Contains all the important aspects regarding a type.
 * @param {Object} schema The schema that was used to construct the type.
 * @param {TypeInfo} typeinfo The type information container.
 * @param {mongoose.Model} model The mongoose model.
 * @param {mongoose.Collection} collection The mongoose collection.
 * @constructor
 */
function Type( schema, typeinfo, model, collection ) {
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
