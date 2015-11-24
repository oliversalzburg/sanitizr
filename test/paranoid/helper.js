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

	it( "should throw on attempts to omit null on non-complex types that are marked complex", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "invalid" );

		var helper         = new TypeHelper( typeInfo );
		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );

		function omitNull() {
			helper.omitNull( personInstance );
		}

		expect( omitNull ).to.throw( HelperError );
	} );

	it( "should throw on attempts to omit hidden on non-complex types that are marked complex", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "invalid" );

		var helper         = new TypeHelper( typeInfo );
		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );

		function omitHidden() {
			helper.omitHidden( personInstance );
		}

		expect( omitHidden ).to.throw( HelperError );
	} );

	it( "should throw on attempts to omit read-only on non-complex types that are marked complex", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "invalid" );

		var helper         = new TypeHelper( typeInfo );
		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );

		function omitReadOnly() {
			helper.omitReadOnly( personInstance );
		}

		expect( omitReadOnly ).to.throw( HelperError );
	} );

	it( "should throw on attempts to conceal on non-complex types that are marked complex", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "invalid" );

		var helper         = new TypeHelper( typeInfo );
		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );

		function conceal() {
			helper.conceal( personInstance );
		}

		expect( conceal ).to.throw( HelperError );
	} );

	it( "should throw on attempts to reduce objects without 'id' property", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = {};

		function reduce() {
			helper.reduceComplex( personInstance );
		}

		expect( reduce ).to.throw( HelperError );
	} );
} );
