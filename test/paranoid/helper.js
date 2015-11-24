// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var expect   = require( "chai" ).expect;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var HelperError = require( "../../lib/error/helper" );
var TypeHelper  = require( "../../lib/type/helper" );
var TypeInfo    = require( "../../lib/type/info" );

// Fixtures
var PersonType = require( "../fixtures/plain" );

describe( "Paranoid: TypeHelper", function() {
	it( "should throw on attempts to omit null on null", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		var helper     = new TypeHelper( typeInfo );

		function reduce() {
			helper.omitNull( null );
		}

		expect( reduce ).to.throw( HelperError );
	} );

	it( "should throw on attempts to omit hidden on null", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		var helper     = new TypeHelper( typeInfo );

		function reduce() {
			helper.omitHidden( null );
		}

		expect( reduce ).to.throw( HelperError );
	} );

	it( "should throw on attempts to omit read-only on null", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		var helper     = new TypeHelper( typeInfo );

		function reduce() {
			helper.omitReadOnly( null );
		}

		expect( reduce ).to.throw( HelperError );
	} );

	it( "should throw on attempts to conceal on null", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		var helper     = new TypeHelper( typeInfo );

		function reduce() {
			helper.conceal( null );
		}

		expect( reduce ).to.throw( HelperError );
	} );

	it( "should throw on attempts to reduce null", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		var helper     = new TypeHelper( typeInfo );

		function reduce() {
			helper.reduceComplex( null );
		}

		expect( reduce ).to.throw( HelperError );
	} );
} );
