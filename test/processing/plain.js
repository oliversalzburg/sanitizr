// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var TypeDecorator = require( "../../lib/type/decorator" );
var TypeHelper    = require( "../../lib/type/helper" );
var TypeInfo      = require( "../../lib/type/info" );

// Fixtures
var PersonType = require( "../fixtures/plain" );

describe( "Processing: Plain Object", function() {
	it( "should omit null values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType );

		var personInstance = PersonType.construct( "id", null, "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "name" );

		helper.omitNull( personInstance );

		personInstance.should.not.have.property( "name" );
	} );

	it( "should omit hidden values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );

		helper.omitHidden( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
	} );

	it( "should ignore inappropriate properties when omitting hidden properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.omitHidden( personInstance, TypeInfo.USERCLASS_USER, false );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
	} );

	it( "should omit read-only values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );

		helper.omitReadOnly( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
	} );

	it( "should ignore inappropriate properties when omitting read-only properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.omitReadOnly( personInstance, TypeInfo.USERCLASS_USER, false );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
	} );

	it( "should conceal concealed values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.have.property( "apiKey" ).that.equals( true );
	} );

	it( "should conceal concealed values with given replacement", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( personInstance, TypeInfo.USERCLASS_USER, false, "foo" );

		personInstance.should.have.property( "apiKey" ).that.equals( "foo" );
	} );

	it( "should ignore inappropriate properties when concealing", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( personInstance, TypeInfo.USERCLASS_USER, false, "foo" );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
	} );
} );

describe( "Processing: Plain Object (with complex)", function() {
	it( "should omit null values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType );

		var personInstance    = PersonType.construct( "id", null, "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", null, "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "name" );
		personInstance.parent.should.have.property( "name" );

		helper.omitNull( personInstance );

		personInstance.should.not.have.property( "name" );
		personInstance.parent.should.not.have.property( "name" );
	} );

	it( "should omit hidden values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" );

		helper.omitHidden( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
		personInstance.parent.should.not.have.property( "apiKey" );
	} );

	it( "should omit read-only values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" );

		helper.omitReadOnly( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
		personInstance.parent.should.not.have.property( "apiKey" );
	} );

	it( "should conceal concealed values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( personInstance, TypeInfo.USERCLASS_USER );

		personInstance.should.have.property( "apiKey" ).that.equals( true );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( true );
	} );

	it( "should conceal concealed values with given replacement", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( personInstance, TypeInfo.USERCLASS_USER, false, "foo" );

		personInstance.should.have.property( "apiKey" ).that.equals( "foo" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "foo" );
	} );

	it( "should reduce complex properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "parent-id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );
		helper.reduceComplex( personInstance );

		personInstance.should.have.property( "parent" ).that.is.a( "string" ).and.equals( "parent-id" );
	} );

	it( "should reduce arrays of complex properties", function() {
		var personType     = PersonType.get();
		personType.parents = [ {} ];

		new TypeDecorator( personType );

		var personInstance     = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parents = [];
		personInstance.parents.push( PersonType.construct( "parent-id", "name", "apiKey", "special" ) );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parents", "person" );

		var helper = new TypeHelper( typeInfo );
		helper.reduceComplex( personInstance );

		personInstance.should.have.property( "parents" ).that.is.an( "array" ).and.has.length( 1 );
		personInstance.parents[ 0 ].should.equal( "parent-id" );
	} );
} );

// ---------------------------------------------------------------------------------------------------------------------

describe( "Processing: Array of Plain Object", function() {
	it( "should omit null values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType );

		var personInstance = PersonType.construct( "id", null, "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "name" );

		helper.omitNull( [ personInstance ] );

		personInstance.should.not.have.property( "name" );
	} );

	it( "should omit hidden values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );

		helper.omitHidden( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
	} );

	it( "should omit read-only values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );

		helper.omitReadOnly( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
	} );

	it( "should conceal concealed values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.have.property( "apiKey" ).that.equals( true );
	} );

	it( "should conceal concealed values with given replacement", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance = PersonType.construct( "id", "name", "apiKey", "special" );
		var typeInfo       = new TypeInfo( "person", personType );
		var helper         = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( [ personInstance ], TypeInfo.USERCLASS_USER, false, "foo" );

		personInstance.should.have.property( "apiKey" ).that.equals( "foo" );
	} );
} );

describe( "Processing: Array of Plain Object (with complex)", function() {
	it( "should omit null values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType );

		var personInstance    = PersonType.construct( "id", null, "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", null, "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "name" );
		personInstance.parent.should.have.property( "name" );

		helper.omitNull( [ personInstance ] );

		personInstance.should.not.have.property( "name" );
		personInstance.parent.should.not.have.property( "name" );
	} );

	it( "should omit hidden values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.HIDDEN );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" );

		helper.omitHidden( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
		personInstance.parent.should.not.have.property( "apiKey" );
	} );

	it( "should omit read-only values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.READ_ONLY );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" );

		helper.omitReadOnly( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.not.have.property( "apiKey" );
		personInstance.parent.should.not.have.property( "apiKey" );
	} );

	it( "should conceal concealed values", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( [ personInstance ], TypeInfo.USERCLASS_USER );

		personInstance.should.have.property( "apiKey" ).that.equals( true );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( true );
	} );

	it( "should conceal concealed values with given replacement", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType )
			.decorate( "apiKey", TypeInfo.USERCLASS_USER, TypeInfo.CONCEALED );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );

		personInstance.should.have.property( "apiKey" ).that.equals( "apiKey" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "apiKey" );

		helper.conceal( [ personInstance ], TypeInfo.USERCLASS_USER, false, "foo" );

		personInstance.should.have.property( "apiKey" ).that.equals( "foo" );
		personInstance.parent.should.have.property( "apiKey" ).that.equals( "foo" );
	} );

	it( "should reduce complex properties", function() {
		var personType = PersonType.get();

		new TypeDecorator( personType );

		var personInstance    = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parent = PersonType.construct( "parent-id", "name", "apiKey", "special" );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parent", "person" );

		var helper = new TypeHelper( typeInfo );
		helper.reduceComplex( [ personInstance ] );

		personInstance.should.have.property( "parent" ).that.is.a( "string" ).and.equals( "parent-id" );
	} );

	it( "should reduce arrays of complex properties", function() {
		var personType     = PersonType.get();
		personType.parents = [ {} ];

		new TypeDecorator( personType );

		var personInstance     = PersonType.construct( "id", "name", "apiKey", "special" );
		personInstance.parents = [];
		personInstance.parents.push( PersonType.construct( "parent-id", "name", "apiKey", "special" ) );

		var typeInfo = new TypeInfo( "person", personType );
		typeInfo.markComplex( "parents", "person" );

		var helper = new TypeHelper( typeInfo );
		helper.reduceComplex( [ personInstance ] );

		personInstance.should.have.property( "parents" ).that.is.an( "array" ).and.has.length( 1 );
		personInstance.parents[ 0 ].should.equal( "parent-id" );
	} );
} );
