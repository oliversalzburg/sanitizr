"use strict";

/*
 The factory module is intended for use with mongoose.
 It is deprecated, but retained for users coming from absync.
 */

var _        = require( "lodash" );
var Type     = require( "./type" );
var TypeInfo = require( "./info" );

module.exports = {
	assemble             : assemble,
	extend               : extend,
	extendWithCollection : extendWithCollection
};

/**
 * Construct a new type.
 * @param {String} typeName The name of the type. For example "Meeting".
 * @param {String} collectionName The name of the collection for the type. For example "meetings".
 * @param {Object} typeDescription An object describing all the elements in the schema of the type.
 * @returns {Type} The type metadata container.
 */
function assemble( typeName, collectionName, typeDescription ) {
	// Only import mongoose if this module is actually used.
	var mongoose = require( "mongoose" );
	var Schema   = mongoose.Schema;

	// Create a schema
	var schema = new Schema(
		typeDescription,
		{
			collection       : collectionName,
			discriminatorKey : "_type"
		}
	);
	// Id should be a virtual to retrieve the object ID as a hex string.
	//noinspection JSUnresolvedFunction
	schema.virtual( "id" ).get( function toHexString() {
		//noinspection JSUnresolvedVariable,JSUnresolvedFunction
		return this._id.toHexString();
	} );
	//noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
	var transformationOptions = {
		getters   : true,
		virtuals  : true,
		transform : function transformDocument( document, result, options ) {
			//noinspection JSUnresolvedVariable,JSUnresolvedFunction
			result.id = document._id.toHexString();
			//noinspection JSUnresolvedVariable
			delete result._id;
		}
	};
	schema.set( "toJSON", transformationOptions );
	schema.set( "toObject", transformationOptions );

	// Register schema as mongoose model
	mongoose.model( typeName, schema );

	//noinspection JSUnresolvedVariable
	var typeExports = new Type( schema,
		new TypeInfo( typeName, typeDescription ),
		mongoose.model( typeName ),
		mongoose.connection.collections[ collectionName ] );

	// Store type description in TypeInfo lookup table.
	TypeInfo.types[ typeName ] = typeExports;

	return typeExports;
}

/**
 * Extend one type with another type.
 * Extended types will share common properties and will be maintained in the same collection.
 * @param {String} typeName The name of the type. For example "IosDevice".
 * @param {String} baseName The name of the base type. For example "Device". This type must already exist.
 * @param {Object} typeDescription An object describing all the elements in the schema of the type.
 * @returns {Type} The type metadata container for the derived type.
 */
function extend( typeName, baseName, typeDescription ) {
	// Only import mongoose if this module is actually used.
	var mongoose = require( "mongoose" );

	var baseTypeInfo = TypeInfo.types[ baseName ];
	if( !baseTypeInfo ) {
		throw new Error( "Invalid base type '" + baseName + "'." );
	}
	// Create a schema
	//noinspection JSUnresolvedFunction
	var schema = baseTypeInfo.schema.extend( typeDescription );
	// Register schema as mongoose model
	mongoose.model( typeName, schema );

	// Now extend our type description so that it covers all inherited properties.
	_.assign( typeDescription, baseTypeInfo.typeinfo.typeDescription );

	var typeExports = new Type( schema,
		new TypeInfo( typeName, typeDescription ),
		mongoose.model( typeName ),
		baseTypeInfo.collection );

	// Store type description in TypeInfo lookup table.
	TypeInfo.types[ typeName ] = typeExports;

	return typeExports;
}

/**
 * Extend one type with another, without sharing the same collection.
 * @param {String} typeName The name of the type. For example "IosDevice".
 * @param {String} baseName The name of the base type. For example "Device". This type must already exist.
 * @param {String} collectionName The name of the collection for the type. For example "meetings".
 * @param {Object} typeDescription An object describing all the elements in the schema of the type.
 * @returns {Type} The type metadata container for the derived type.
 */
function extendWithCollection( typeName, baseName, collectionName, typeDescription ) {
	// Only import mongoose if this module is actually used.
	var mongoose = require( "mongoose" );

	var baseTypeInfo = TypeInfo.types[ baseName ];
	if( !baseTypeInfo ) {
		throw new Error( "Invalid base type '" + baseName + "'." );
	}
	// Create a schema
	//noinspection JSUnresolvedFunction
	var schema                = baseTypeInfo.schema.extend( typeDescription );
	schema.options.collection = collectionName;
	// Register schema as mongoose model
	mongoose.model( typeName, schema );

	// Now extend our type description so that it covers all inherited properties.
	_.assign( typeDescription, baseTypeInfo.typeinfo.typeDescription );

	//noinspection JSUnresolvedVariable
	var typeExports = new Type( schema,
		new TypeInfo( typeName, typeDescription ),
		mongoose.model( typeName ),
		mongoose.connection.collections[ collectionName ] );

	// Store type description in TypeInfo lookup table.
	TypeInfo.types[ typeName ] = typeExports;

	return typeExports;
}
