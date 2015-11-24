"use strict";

var _              = require( "lodash" );
var DecoratorError = require( "../error/decorator" );
var TypeInfo       = require( "./info" );
var util           = require( "util" );

module.exports = TypeDecorator;

function TypeDecorator( typeDescription ) {
	this.typeDescription = typeDescription;
}

function internalDecorate( typeDescription, propertyName, userClass, attribute ) {
	if( Array.isArray( typeDescription[ propertyName ] ) ) {
		internalDecorate( typeDescription[ propertyName ], 0, userClass, attribute );
		return;
	}

	Object.defineProperty( typeDescription[ propertyName ], TypeInfo.INFO_PROPERTY, {
		configurable : true,
		enumerable   : false,
		writable     : true
	} );
	typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ]              = typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ] || {};
	typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ] = typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ] || [];

	if( util.isArray( attribute ) ) {
		typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ] =
			typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ].concat( attribute );

		typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ] = _.uniq( typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ] );

	} else {
		if( !_.contains( typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ], attribute ) ) {
			typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ].push( attribute );
		}
	}
}

//noinspection JSUnusedGlobalSymbols
/**
 * Decorate a property in a type with a certain attribute.
 * @param propertyName
 * @param userClass
 * @param attribute
 */
TypeDecorator.prototype.decorate = function TypeDecorator$decorate( propertyName, userClass, attribute ) {
	if( typeof this.typeDescription[ propertyName ] == "undefined" ) {
		log.warn( "Unable to decorate non-existent property '" + propertyName + "'." );
		return this;
	}

	internalDecorate( this.typeDescription, propertyName, userClass, attribute );

	return this;
};

TypeDecorator.prototype.decorateDeep = function TypeDecorator$decorateDeep() {
	if( arguments.length < 3 ) {
		log.error( "Too few arguments to decorateDeep(). Expected property path, user class and attribute." );
		return this;
	}

	var args         = Array.prototype.slice.call( arguments, 0 );
	var attribute    = args[ args.length - 1 ];
	var userClass    = args[ args.length - 2 ];
	var propertyPath = args.splice( 0, args.length - 2 );

	var decorate = Function.prototype;
	propertyPath.reduce( function walkPath( object, index ) {
		if( !object.hasOwnProperty( index ) ) {
			object[ index ] = {};
		}
		decorate = function decorator() {// jscs:ignore requireFunctionDeclarations
			internalDecorate( object, index, userClass, attribute );
		};
		return object[ index ];
	}, this.typeDescription );
	decorate();

	return this;
};

