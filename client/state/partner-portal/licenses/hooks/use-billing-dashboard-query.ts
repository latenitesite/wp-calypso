/**
 * External dependencies
 */
import { useQuery, UseQueryOptions, UseQueryResult } from 'react-query';

/**
 * Internal dependencies
 */
import wpcom from 'calypso/lib/wp';

interface APIBillingSummaryCounts {
	assigned: number;
	unassigned: number;
	total: number;
}

interface APIBillingSummaryProduct {
	product_slug: string;
	product_name: string;
	product_cost: number;
	product_total_cost: number;
	counts: APIBillingSummaryCounts;
}

interface APIBillingSummaryCosts {
	total: number;
	assigned: number;
	unassigned: number;
}

interface APIBillingSummary {
	date: string;
	products: APIBillingSummaryProduct[];
	licenses: APIBillingSummaryCounts;
	costs: APIBillingSummaryCosts;
}

function queryBillingDashboard(): Promise< APIBillingSummary > {
	// TODO use actual API endpoint.
	return wpcom.req
		.get( {
			apiNamespace: 'wpcom/v2',
			path: '/jetpack-licensing/product-families',
		} )
		.then( () => ( {
			date: '2021-03-01',
			products: [
				{
					product_slug: 'jetpack-backup-daily',
					product_name: 'Jetpack Backup Daily',
					product_cost: 17,
					product_total_cost: 884,
					counts: {
						assigned: 44,
						unassigned: 8,
						total: 52,
					},
				},
				{
					product_slug: 'jetpack-security-daily',
					product_name: 'Jetpack Security Daily',
					product_cost: 79,
					product_total_cost: 948,
					counts: {
						assigned: 0,
						unassigned: 12,
						total: 12,
					},
				},
				{
					product_slug: 'jetpack-complete',
					product_name: 'Jetpack Complete',
					product_cost: 139,
					product_total_cost: 174862,
					counts: {
						assigned: 1258,
						unassigned: 0,
						total: 1258,
					},
				},
			],
			licenses: {
				total: 1348,
				assigned: 1324,
				unassigned: 24,
			},
			costs: {
				total: 177916,
				assigned: 176644,
				unassigned: 1272,
			},
		} ) );
}

interface BillingSummaryCounts {
	assigned: number;
	unassigned: number;
	total: number;
}

interface BillingSummaryProduct {
	productSlug: string;
	productName: string;
	productCost: number;
	productTotalCost: number;
	counts: BillingSummaryCounts;
}

interface BillingSummaryCosts {
	total: number;
	assigned: number;
	unassigned: number;
}

interface BillingSummary {
	date: string;
	products: BillingSummaryProduct[];
	licenses: BillingSummaryCounts;
	costs: BillingSummaryCosts;
}

function selectBillingDashboard( api: APIBillingSummary ): BillingSummary {
	return {
		date: api.date,
		products: api.products.map(
			( product ): BillingSummaryProduct => ( {
				productSlug: product.product_slug,
				productName: product.product_name,
				productCost: product.product_cost,
				productTotalCost: product.product_total_cost,
				counts: product.counts,
			} )
		),
		licenses: api.licenses,
		costs: api.costs,
	};
}

export default function useBillingDashboardQuery< TError = unknown >(
	options?: UseQueryOptions< APIBillingSummary, TError, BillingSummary >
): UseQueryResult< BillingSummary, TError > {
	return useQuery< APIBillingSummary, TError, BillingSummary >(
		[ 'partner-portal', 'billing-dashboard' ],
		queryBillingDashboard,
		{
			select: selectBillingDashboard,
			...options,
		}
	);
}
