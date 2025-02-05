/**
 * Collapse Sidebar Menu Item
 *
 **/

/**
 * External dependencies
 */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

/**
 * Internal dependencies
 */
import SidebarItem from 'calypso/layout/sidebar/item';
import SidebarCustomIcon from 'calypso/layout/sidebar/custom-icon';
import { getSidebarIsCollapsed } from 'calypso/state/ui/selectors';
import { collapseSidebar, expandSidebar } from 'calypso/state/ui/actions';
import TranslatableString from 'calypso/components/translatable/proptype';

export const CollapseSidebar = ( { title, icon } ) => {
	const reduxDispatch = useDispatch();
	const sidebarIsCollapsed = useSelector( getSidebarIsCollapsed );

	return (
		<SidebarItem
			className="collapse-sidebar__toggle"
			onNavigate={
				sidebarIsCollapsed
					? () => reduxDispatch( expandSidebar() )
					: () => reduxDispatch( collapseSidebar() )
			}
			label={ title }
			link={ '' }
			customIcon={ <SidebarCustomIcon icon={ icon } /> }
		/>
	);
};

CollapseSidebar.propTypes = {
	title: TranslatableString.isRequired,
	icon: PropTypes.string.isRequired,
};

export default CollapseSidebar;
