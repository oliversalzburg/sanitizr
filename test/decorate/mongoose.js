// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var TypeDecorator = require( "../../lib/type/decorator" );
var TypeInfo      = require( "../../lib/type/info" );

// Fixtures
var PersonType = require( "../fixtures/mongoose" );

describe( "Decoration: Mongoose", function() {
	it( "should decorate a type field", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );
} );
