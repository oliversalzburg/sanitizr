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
	if( propertyName && Array.isArray( typeDescription[ propertyName ] ) ) {
		internalDecorate( typeDescription[ propertyName ], 0, userClass, attribute );
		return;
	}

	var targetProperty = propertyName !== null ? typeDescription[ propertyName ] : typeDescription;

	if( Array.isArray( userClass ) ) {
		_.forEach( userClass, _.partial( internalDecorate, typeDescription, propertyName, _, attribute ) );
		return;
	}

	Object.defineProperty( targetProperty, TypeInfo.INFO_PROPERTY, {
		configurable : true,
		enumerable   : false,
		writable     : true
	} );
	targetProperty[ TypeInfo.INFO_PROPERTY ]              = targetProperty[ TypeInfo.INFO_PROPERTY ] || {};
	targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ] = targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ] || [];

	if( util.isArray( attribute ) ) {
		targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ] =
			targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ].concat( attribute );

		targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ] = _.uniq( targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ] );

	} else {
		if( !_.includes( targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ], attribute ) ) {
			targetProperty[ TypeInfo.INFO_PROPERTY ][ userClass ].push( attribute );
		}
	}
}

//noinspection JSUnusedGlobalSymbols
/**
 * Decorate a property in a type with a certain attribute.
 * @param {String} [propertyName] The name of the property to decorate. If omitted, the whole type is decorated.
 * @param {String|String[]} userClass The user class(es) for which to apply the decoration.
 * @param {String|String[]} attribute The attribute(s) to set.
 */
TypeDecorator.prototype.decorate = function TypeDecorator$decorate( propertyName, userClass, attribute ) {
	if( typeof attribute === "undefined" ) {
		attribute    = userClass;
		userClass    = propertyName;
		propertyName = null;
	}

	if( propertyName && typeof this.typeDescription[ propertyName ] === "undefined" ) {
		throw new DecoratorError( "Unable to decorate non-existent property '" + propertyName + "'." );
	}

	if( propertyName && typeof this.typeDescription[ propertyName ] === "function" ) {
		// Attempts to decorate function type properties usually means the user is using the shorthand
		// type identifiers (like String, Number) in mongoose.
		throw new DecoratorError( "Attempting to decorate function type property '" + propertyName + "' is probably unintended!" );
	}

	internalDecorate( this.typeDescription, propertyName, userClass, attribute );

	return this;
};

/**
 * Decorate a property in a type, where the property does not exist at the time of definition of the type.
 * @param {String} [compositeName The name of the property.
 * @param {String|String[]} userClass The user class(es) for which to apply the decoration.
 * @param {String|String[]} attribute The attribute(s) to set.
 */
TypeDecorator.prototype.decorateComposite = function TypeDecorator$decorateComposite( compositeName, userClass, attribute ) {
	// Refuse to decorate existing properties on the type, unless it's a composite
	if( this.typeDescription[ compositeName ] ) {
		if( !this.typeDescription.__COMPOSITES__ ||
		    ( this.typeDescription.__COMPOSITES__ && -1 === this.typeDescription.__COMPOSITES__.indexOf( compositeName ) ) ) {
			throw new DecoratorError( "Unable to decorate existing property '" + compositeName + "'." );
		}
	}

	if( "undefined" === typeof this.typeDescription.__COMPOSITES__ ) {
		Object.defineProperty( this.typeDescription, "__COMPOSITES__", {
			configurable : false,
			enumerable   : false,
			value        : [],
			writable     : false
		} );
	}

	if( -1 === this.typeDescription.__COMPOSITES__.indexOf( compositeName ) ) {
		this.typeDescription.__COMPOSITES__.push( compositeName );
	}

	if( "undefined" === typeof this.typeDescription[ compositeName ] ) {
		Object.defineProperty( this.typeDescription, compositeName, {
			configurable : true,
			enumerable   : false,
			value        : {},
			writable     : true
		} );
	}

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

