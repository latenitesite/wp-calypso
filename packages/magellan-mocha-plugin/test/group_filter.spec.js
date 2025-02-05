const chai = require( 'chai' );
const expect = chai.expect;
const testFramework = require( '../index' );
const filters = testFramework.filters;
const tests = [ 'a', 'b', 'b/x', 'c', 'd' ].map( function ( f ) {
	return { filename: f + '/spec.js' };
} );

describe( 'group filter', function () {
	it( 'returns all tests when no partial given', function () {
		const filtered = filters.group( tests );
		expect( filtered ).to.equal( tests );
	} );

	it( 'filters by a single partial', function () {
		const filtered = filters.group( tests, 'b' );
		expect( filtered ).to.have.length( 2 );
		expect( filtered[ 1 ] ).to.have.property( 'filename' ).that.equals( 'b/x/spec.js' );
	} );

	it( 'filters by multiple partials', function () {
		const filtered = filters.group( tests, [ 'b', 'd' ] );
		expect( filtered ).to.have.length( 3 );
		expect( filtered[ 2 ] ).to.have.property( 'filename' ).that.equals( 'd/spec.js' );
	} );
} );
