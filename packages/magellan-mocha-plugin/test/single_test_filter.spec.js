const path = require( 'path' );
const sinon = require( 'sinon' );
const chai = require( 'chai' );
const expect = chai.expect;
const testFramework = require( '../index' );
const filters = testFramework.filters;
const tests = [];

'a b c'.split( ' ' ).forEach( function ( f ) {
	// create two tests per file
	for ( let i = 0; i < 2; i++ ) {
		tests.push( { filename: 'path/to/' + f + '.js' } );
	}
} );

describe( 'single test filter', function () {
	beforeEach( function () {
		sinon.stub( path, 'resolve', function ( p ) {
			return p;
		} );
	} );

	afterEach( function () {
		path.resolve.restore();
	} );

	it( 'returns the tests matching the given file', function () {
		const filtered = filters.test( tests, 'path/to/b.js' );
		expect( filtered ).to.have.length( 2 );
		expect( filtered[ 0 ] ).to.have.property( 'filename' ).that.equals( 'path/to/b.js' );
	} );
} );
