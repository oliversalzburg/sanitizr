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

	it( "should decorate a type field and ignore identical decorations", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a type field and extend existing decorations", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN )
			.decorate( "name", TypeInfo.USERCLASS_ADMIN, TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_ADMIN )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.HIDDEN );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_ADMIN ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a composite type field", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateComposite( "composite", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.composite.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.composite[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.composite[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a composite type field and ignore duplicate decorations", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateComposite( "composite", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY )
			.decorateComposite( "composite", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.composite.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.composite[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.composite[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a composite type field and extend existing decorations", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateComposite( "composite", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN )
			.decorateComposite( "composite", TypeInfo.USERCLASS_ADMIN, TypeInfo.READ_ONLY );

		personType.composite.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.composite[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.composite[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_ADMIN )
			.that.is.an( "array" ).with.length( 1 );
		personType.composite[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.HIDDEN );
		personType.composite[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_ADMIN ][ 0 ].should.equal( TypeInfo.READ_ONLY );
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

	it( "should decorate a nested type field and ignore duplicate decorations", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateDeep( "properties", "special", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY )
			.decorateDeep( "properties", "special", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		personType.properties.special.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.properties.special[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.properties.special[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should decorate a type field with multiple attributes", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, [ TypeInfo.READ_ONLY, TypeInfo.HIDDEN ] );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 2 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ].should.include( TypeInfo.READ_ONLY );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ].should.include( TypeInfo.HIDDEN );
	} );

	it( "should decorate a type field for multiple user classes", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", [ TypeInfo.USERCLASS_USER, TypeInfo.USERCLASS_ADMIN ], TypeInfo.READ_ONLY );

		personType.name.should.have.property( TypeInfo.INFO_PROPERTY );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_USER )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ].should.have.property( TypeInfo.USERCLASS_ADMIN )
			.that.is.an( "array" ).with.length( 1 );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
		personType.name[ TypeInfo.INFO_PROPERTY ][ TypeInfo.USERCLASS_ADMIN ][ 0 ].should.equal( TypeInfo.READ_ONLY );
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
