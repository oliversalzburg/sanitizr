// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var TypeDecorator = require( "../lib/type/decorator" );
var TypeInfo      = require( "../lib/type/info" );

// Fixtures
var PersonType = require( "./fixtures/person" );

describe( "sanitizr", function() {
	it( "should decorate a type description", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
	} );
} );
