// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

const mocha = require( "mocha" );

const describe = mocha.describe;
const it       = mocha.it;
const should   = require( "chai" ).should();

// Library modules
const TypeDecorator = require( "../../lib/type/decorator" );
const TypeInfo      = require( "../../lib/type/info" );

// Fixtures
const PersonType = require( "../fixtures/plain" );

describe( "Info: Plain Object", () => {
	it( "should create valid type information", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		const typeInfo = new TypeInfo( "person", personType );

		typeInfo.should.have.property( "typeInfo" ).that.is.an( "object" );
		typeInfo.typeInfo.should.have.property( "name" ).that.is.an( "object" );
		typeInfo.typeInfo.name.should.have.property( TypeInfo.USERCLASS_USER ).that.is.an( "array" ).with.length( 1 );
		typeInfo.typeInfo.name[ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should create valid type information with falsey values in schema", () => {
		const personType = PersonType.get();
		personType.something = undefined;

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		const typeInfo = new TypeInfo( "person", personType );

		typeInfo.should.have.property( "typeInfo" ).that.is.an( "object" );
		typeInfo.typeInfo.should.have.property( "name" ).that.is.an( "object" );
		typeInfo.typeInfo.name.should.have.property( TypeInfo.USERCLASS_USER ).that.is.an( "array" ).with.length( 1 );
		typeInfo.typeInfo.name[ TypeInfo.USERCLASS_USER ][ 0 ].should.equal( TypeInfo.READ_ONLY );
	} );

	it( "should identify a type by name", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "name", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		const typeInfo = new TypeInfo( "person", personType );

		typeInfo.is( "person" ).should.equal( true );
		typeInfo.is( "foo" ).should.equal( false );
	} );

	it( "should identify hidden properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isHidden( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isHidden( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify read-only properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isReadOnly( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify concealed properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isConcealed( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
		typeInfo.isConcealed( "name", TypeInfo.USERCLASS_USER ).should.equal( false );
	} );

	it( "should identify concealed properties as read-only", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey", TypeInfo.USERCLASS_USER ).should.equal( true );
	} );

	it( "should identify properties which are marked complex", () => {
		const personType = PersonType.get();

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		typeInfo.isComplex( "parent" ).should.equal( true );
		typeInfo.isComplex( "name" ).should.equal( false );
	} );

	it( "should identify composite properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorateComposite( "composite", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );
		const typeInfo = new TypeInfo( "person", personType );

		typeInfo.isReadOnly( "composite" ).should.equal( true );
	} );

	it( "should give us the complex type", () => {
		const personType = PersonType.get();

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		typeInfo.complex( "parent" ).should.equal( "person" );
	} );
} );

describe( "Info: Plain Object with default User Class checks", () => {
	it( "should identify hidden properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isHidden( "apiKey" ).should.equal( true );
		typeInfo.isHidden( "name" ).should.equal( false );
	} );

	it( "should identify read-only properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey" ).should.equal( true );
		typeInfo.isReadOnly( "name" ).should.equal( false );
	} );

	it( "should identify concealed properties", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isConcealed( "apiKey" ).should.equal( true );
		typeInfo.isConcealed( "name" ).should.equal( false );
	} );

	it( "should identify concealed properties as read-only", () => {
		const personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		const typeInfo = new TypeInfo( "person", personType );
		typeInfo.isReadOnly( "apiKey" ).should.equal( true );
	} );
} );
