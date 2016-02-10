// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var expect   = require( "chai" ).expect;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var DecoratorError = require( "../../lib/error/decorator" );
var TypeDecorator  = require( "../../lib/type/decorator" );
var TypeInfo       = require( "../../lib/type/info" );

// Fixtures
var PersonType = require( "../fixtures/sql" );

describe( "Paranoid: Decorator", function() {
	it( "should throw on attempts to decorate non-existent property", function() {
		var personType = PersonType.get();

		function decorate() {
			new TypeDecorator( personType )
				.decorate( "nonexistent", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );
		}

		expect( decorate ).to.throw( DecoratorError );
	} );

	it( "should throw on attempts to decorate existent property as composite", function() {
		var personType = PersonType.get();

		function decorate() {
			new TypeDecorator( personType )
				.decorateComposite( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );
		}

		expect( decorate ).to.throw( DecoratorError );
	} );

	it( "should throw on attempts to decorate deep property with invalid arguments", function() {
		var personType = PersonType.get();

		function decorate() {
			new TypeDecorator( personType )
				.decorateDeep( "nonexistent" );
		}

		expect( decorate ).to.throw( DecoratorError );
	} );
} );
