/**
 * External dependencies
 */
import { defaultRegistry } from '@automattic/composite-checkout';
import type { ManagedContactDetails } from '@automattic/wpcom-checkout';

/**
 * Internal dependencies
 */
import { tryToGuessPostalCodeFormat } from 'calypso/lib/postal-code';

const { select } = defaultRegistry;

export default function getPostalCode(): string {
	const managedContactDetails: ManagedContactDetails | undefined = select(
		'wpcom'
	)?.getContactInfo();
	if ( ! managedContactDetails ) {
		return '';
	}
	const countryCode = managedContactDetails.countryCode?.value ?? '';
	const postalCode = managedContactDetails.postalCode?.value ?? '';
	return tryToGuessPostalCodeFormat( postalCode.toUpperCase(), countryCode );
}
