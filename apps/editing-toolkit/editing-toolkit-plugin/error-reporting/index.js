/**
 * Wordpress dependencies
 */
import apiFetch from '@wordpress/api-fetch';

/**
 * Errors that happened before this script had a chance to load
 * are captured in a global array. See `./index.php`.
 */
const headErrors = window._jsErr || [];
const headErrorHandler = window._headJsErrorHandler;
const isAtomic = window.a8cFseErrorReportingData.isAtomic || false;
let endpointConfig;

if ( isAtomic ) {
	endpointConfig = { url: 'https://public.wordpress.com/rest/v1.1/js-error' };
} else {
	endpointConfig = { path: '/rest/v1.1/js-error' };
}

const reportError = ( { error } ) => {
	// This is debug code and will be removed later.
	console.log( `reportError()`, error );
	if ( ! error ) {
		console.log(
			'Ooopsie, we just got a sanitized "Script Error.". I hope you were expecting it! :)'
		);
		return;
	}

	const data = {
		message: error.message,
		trace: error.stack,
		url: document.location.href,
		feature: 'wp-admin',
	};

	return (
		apiFetch(
			Object.assign(
				{
					global: true,
					method: 'POST',
					data: { error: JSON.stringify( data ) },
				},
				endpointConfig
			)
		)
			.then( () => console.log( 'Reported Error!', error.message ) )
			// eslint-disable-next-line no-console
			.catch( () => console.error( 'Error: Unable to record the error in Logstash.' ) )
	);
};

window.addEventListener( 'error', reportError );

// Remove the head handler as it's not needed anymore after we set the main one above
window.removeEventListener( 'error', headErrorHandler );
delete window._headJsErrorHandler;

// We still need to report the head errors, if any.
Promise.allSettled( headErrors.map( reportError ) ).then( () => delete window._jsErr );
