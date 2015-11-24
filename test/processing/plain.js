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
} );
