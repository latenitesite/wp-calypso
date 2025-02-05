const path = require( 'path' );
const chai = require( 'chai' );
const expect = chai.expect;
const Locator = require( '../lib/locator' );
const testFramework = require( '../index' );

function getTestsFrom( specs ) {
	if ( ! Array.isArray( specs ) ) {
		specs = [ specs ];
	}
	testFramework.initialize( {
		mocha_tests: specs,
		mocha_opts: path.join( specs[ 0 ], 'mocha.opts' ),
		suiteTag: 'suite;multiple',
	} );
	return testFramework.iterator( { tempDir: path.resolve( '.' ) } );
}

describe( 'suite iterator', function () {
	let suites;

	before( function () {
		suites = getTestsFrom( './test_support/suite' );
	} );

	it( 'finds suites', function () {
		expect( suites ).to.have.length( 3 );
	} );

	it( 'instantiates tests as Locators', function () {
		expect( suites[ 0 ] ).to.be.an.instanceOf( Locator );
	} );

	it( 'collects details of a test', function () {
		const suite = suites[ 0 ];
		expect( suite.name ).to.equal( 'Suite @suite' );
		expect( suites[ 0 ].filename ).to.contain( 'test_support/suite/spec.js' );
	} );
} );
