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

	if( Array.isArray( userClass ) ) {
		_.forEach( userClass, _.partial( internalDecorate, typeDescription, propertyName, _, attribute ) );
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
		if( !_.includes( typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ], attribute ) ) {
			typeDescription[ propertyName ][ TypeInfo.INFO_PROPERTY ][ userClass ].push( attribute );
		}
	}
}

//noinspection JSUnusedGlobalSymbols
/**
 * Decorate a property in a type with a certain attribute.
 * @param {String} propertyName The name of the property to decorate.
 * @param {String|String[]} userClass The user class(es) for which to apply the decoration.
 * @param {String|String[]} attribute The attribute(s) to set.
 */
TypeDecorator.prototype.decorate = function TypeDecorator$decorate( propertyName, userClass, attribute ) {
	if( typeof this.typeDescription[ propertyName ] === "undefined" ) {
		throw new DecoratorError( "Unable to decorate non-existent property '" + propertyName + "'." );
	}

	if( typeof this.typeDescription[ propertyName ] === "function" ) {
		// Attempts to decorate function type properties usually means the user is using the shorthand
		// type identifiers (like String, Number) in mongoose.
		throw new DecoratorError( "Attempting to decorate function type property '" + propertyName + "' is probably unintended!" );
	}

	internalDecorate( this.typeDescription, propertyName, userClass, attribute );

	return this;
};

/**
 * Decorate a property in a type, where the property does not exist at the time of definition of the type.
 * @param {String} compositeName The name of the property.
 * @param {String|String[]} userClass The user class(es) for which to apply the decoration.
 * @param {String|String[]} attribute The attribute(s) to set.
 */
TypeDecorator.prototype.decorateComposite = function TypeDecorator$decorateComposite( compositeName, userClass, attribute ) {
	if( this.typeDescription[ compositeName ] ) {
		throw new DecoratorError( "Unable to decorate existing property '" + compositeName + "'." );
	}

	if( !this.typeDescription.__COMPOSITES__ ) {
		Object.defineProperty( this.typeDescription, "__COMPOSITES__", {
			configurable : false,
			enumerable   : false,
			value        : [],
			writable     : false
		} );
	}

	this.typeDescription.__COMPOSITES__.push( compositeName );

	Object.defineProperty( this.typeDescription, compositeName, {
		configurable : true,
		enumerable   : false,
		value        : {},
		writable     : true
	} );

	internalDecorate( this.typeDescription, compositeName, userClass, attribute );

	return this;
};

TypeDecorator.prototype.decorateDeep = function TypeDecorator$decorateDeep() {
	if( arguments.length < 3 ) {
		throw new DecoratorError( "Too few arguments to decorateDeep(). Expected property path, user class and attribute." );
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

