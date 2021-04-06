/**
 * External dependencies
 */
import React, { ReactElement } from 'react';
import { useTranslate } from 'i18n-calypso';
import formatCurrency from '@automattic/format-currency';

/**
 * Internal dependencies
 */
import { Card } from '@automattic/components';

/**
 * Style dependencies
 */
import './style.scss';

export default function BillingDetails(): ReactElement {
	const translate = useTranslate();

	return (
		<div className="billing-details">
			<Card compact className="billing-details__header">
				<div className="billing-details__row">
					<div>{ translate( 'Products' ) }</div>
					<div>{ translate( 'Assigned' ) }</div>
					<div>{ translate( 'Unassigned' ) }</div>
					<div></div>
				</div>
			</Card>

			<Card compact>
				<div className="billing-details__row">
					<div className="billing-details__product">
						Jetpack Backup Daily
						<span className="billing-details__line-item-meta">
							{ translate( 'Price per license: %(price)s', {
								args: { price: formatCurrency( 17, 'USD' ) },
							} ) }
						</span>
					</div>
					<div className="billing-details__assigned">
						44
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Assigned' ) }
						</span>
					</div>
					<div className="billing-details__unassigned">
						8
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Unassigned' ) }
						</span>
					</div>
					<div className="billing-details__subtotal">
						{ translate( '%(count)d License', '%(count)d Licenses', {
							count: 52,
							args: { count: 52 },
						} ) }
						<span className="billing-details__line-item-meta">
							{ translate( 'Subtotal: %(subtotal)s', {
								args: { subtotal: formatCurrency( 884, 'USD' ) },
							} ) }
						</span>
					</div>
				</div>
			</Card>

			<Card compact>
				<div className="billing-details__row">
					<div className="billing-details__product">
						Jetpack Backup Daily
						<span className="billing-details__line-item-meta">
							{ translate( 'Price per license: %(price)s', {
								args: { price: formatCurrency( 17, 'USD' ) },
							} ) }
						</span>
					</div>
					<div className="billing-details__assigned">
						44
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Assigned' ) }
						</span>
					</div>
					<div className="billing-details__unassigned">
						8
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Unassigned' ) }
						</span>
					</div>
					<div className="billing-details__subtotal">
						{ translate( '%(count)d License', '%(count)d Licenses', {
							count: 52,
							args: { count: 52 },
						} ) }
						<span className="billing-details__line-item-meta">
							{ translate( 'Subtotal: %(subtotal)s', {
								args: { subtotal: formatCurrency( 884, 'USD' ) },
							} ) }
						</span>
					</div>
				</div>
			</Card>

			<Card compact>
				<div className="billing-details__row">
					<div className="billing-details__product">
						Jetpack Backup Daily
						<span className="billing-details__line-item-meta">
							{ translate( 'Price per license: %(price)s', {
								args: { price: formatCurrency( 17, 'USD' ) },
							} ) }
						</span>
					</div>
					<div className="billing-details__assigned">
						44
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Assigned' ) }
						</span>
					</div>
					<div className="billing-details__unassigned">
						8
						<span className="billing-details__line-item-meta billing-details__line-item-meta--is-mobile">
							{ translate( 'Unassigned' ) }
						</span>
					</div>
					<div className="billing-details__subtotal">
						{ translate( '%(count)d License', '%(count)d Licenses', {
							count: 52,
							args: { count: 52 },
						} ) }
						<span className="billing-details__line-item-meta">
							{ translate( 'Subtotal: %(subtotal)s', {
								args: { subtotal: formatCurrency( 884, 'USD' ) },
							} ) }
						</span>
					</div>
				</div>
			</Card>

			<Card compact className="billing-details__footer">
				<div className="billing-details__row billing-details__row--summary">
					<span className="billing-details__total-label billing-details__cost-label">
						{ translate( 'Cost for {{bold}}%(date)s{{/bold}}', {
							components: { bold: <strong /> },
							args: { date: 'March, 2021' },
						} ) }
					</span>
					<strong className="billing-details__cost-amount">
						{ formatCurrency( 177916, 'USD' ) }
					</strong>

					<span className="billing-details__total-label billing-details__line-item-meta">
						{ translate( 'Assigned licenses:' ) }
					</span>
					<span className="billing-details__line-item-meta">
						{ formatCurrency( 176644, 'USD' ) }
					</span>

					<span className="billing-details__total-label billing-details__line-item-meta">
						{ translate( 'Unassigned licenses:' ) }
					</span>
					<span className="billing-details__line-item-meta">{ formatCurrency( 1272, 'USD' ) }</span>
				</div>
			</Card>
		</div>
	);
}
