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
var PersonType = require( "../fixtures/plain" );

describe( "Info: Plain Object", function() {
	it( "should create valid type information", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var typeInfo = new TypeInfo( "person", personType );

		typeInfo.should.have.property( "typeInfo" ).that.is.an( "object" );
		typeInfo.typeInfo.should.have.property( "name" ).that.is.an( "object" );
		typeInfo.typeInfo.name.should.have.property( TypeInfo.USERCLASS_USER ).that.is.an( "array" ).with.length( 1 );
		typeInfo.typeInfo.name[ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should identify a type by name", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var typeInfo = new TypeInfo( "person", personType );

		typeInfo.is( "person" ).should.equal( true );
		typeInfo.is( "foo" ).should.equal( false );
	} );

	it( "should identify hidden properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isHidden( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isHidden( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify read-only properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isReadOnly( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify concealed properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isConcealed( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isConcealed( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify concealed properties as read-only", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
	} );

	it( "should identify properties which are marked complex", function() {
		var personType = PersonType.get();

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		typeInfo.isComplex( "parent" ).should.equal( true );
		typeInfo.isComplex( "name" ).should.equal( false );
	} );

	it( "should give us the complex type", function() {
		var personType = PersonType.get();

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		typeInfo.complex( "parent" ).should.equal( "person" );
	} );
} );

describe( "Info: Plain Object with default User Class checks", function() {
	it( "should identify hidden properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isHidden( "apiKey" ).should.equal( true );
		typeInfo.isHidden( "name" ).should.equal( false );
	} );

	it( "should identify read-only properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey" ).should.equal( true );
		typeInfo.isReadOnly( "name" ).should.equal( false );
	} );

	it( "should identify concealed properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isConcealed( "apiKey" ).should.equal( true );
		typeInfo.isConcealed( "name" ).should.equal( false );
	} );

	it( "should identify concealed properties as read-only", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey" ).should.equal( true );
	} );
} );
