// jscs:disable disallowAnonymousFunctions, requireNamedUnassignedFunctions, requireSpaceAfterKeywords
"use strict";

var mocha = require( "mocha" );

var describe = mocha.describe;
var it       = mocha.it;
var should   = require( "chai" ).should();

// Library modules
var DecoratorError = require( "../../lib/error/decorator" );
var HelperError    = require( "../../lib/error/helper" );
var InfoError      = require( "../../lib/error/info" );


describe( "Errors", function() {
	it( "DecoratorError should be an Error", function() {
		var error = new DecoratorError();
		error.should.be.an.instanceOf( Error );
	} );

	it( "HelperError should be an Error", function() {
		var error = new HelperError();
		error.should.be.an.instanceOf( Error );
	} );

	it( "InfoError should be an Error", function() {
		var error = new InfoError();
		error.should.be.an.instanceOf( Error );
	} );
} );
