// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var expect   = require( "chai" ).expect;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var InfoError  = require( "../../lib/error/info" );
var TypeInfo   = require( "../../lib/type/info" );

// Fixtures
var PersonType = require( "../fixtures/plain" );

describe( "Paranoid: TypeInfo", function() {
	it( "should throw on attempts to mark a complex without a type", function() {
		var personType = PersonType.get();
		var typeInfo   = new TypeInfo( "person", personType );

		function omitNull() {
			typeInfo.markComplex( "anything" );
		}

		expect( omitNull ).to.throw( InfoError );
	} );

} );
