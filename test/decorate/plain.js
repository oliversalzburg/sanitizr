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
var PersonType = require( "../fixtures/sql" );

describe( "Decoration: Plain Object", function() {
	it( "should decorate a type field", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a nested type field", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateDeep( "properties", "special", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.properties.special.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.properties.special[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.properties.special[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a type field", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, [ TypeInfo.READ_ONLY, TypeInfo.HIDDEN ] );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 2 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ].should.include( TypeInfo.READ_ONLY );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ].should.include( TypeInfo.HIDDEN );
	} );

	it( "should decorate a array type field", function() {
		var personType     = PersonType.get();
		personType.parents = [ {} ];

		new TypeDecorator( personType )
			.decorate( "parents", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.parents.should.be.an( "array" ).with.length.gt( 0 );
		personType.parents[ 0 ].should.have.property( TypeInfo.INFO_PROPERTY );
		personType.parents[ 0 ][ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.parents[ 0 ][ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );
} );
