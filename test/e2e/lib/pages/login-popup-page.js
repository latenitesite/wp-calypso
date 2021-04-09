/**
 * External dependencies
 */
import { By, Key } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import LoginPage from './login-page.js';

import * as driverHelper from '../driver-helper.js';

// This is the Calypso WordPress.com login page
// For the wp-admin login page see /wp-admin/wp-admin-logon-page
export default class LoginPopupPage extends LoginPage {
	static async Login( driver, username, password ) {
		// Switch to new window opened
		const handles = await driver.getAllWindowHandles();
		await driver.switchTo().window( handles[ 1 ] );

		const page = new this( driver, By.css( '.wp-login__container' ) );
		await page._expectInit();

		await page.login( username, password );

		// Switch back to post window
		await driver.switchTo().window( handles[ 0 ] );
	}

	async login( username, password ) {
		const driver = this.driver;

		const alreadyLoggedInSelector = By.css( '.continue-as-user' );
		const isDisplayed = await driverHelper.isEventuallyPresentAndDisplayed(
			driver,
			alreadyLoggedInSelector,
			2000
		);
		if ( isDisplayed ) {
			const changeAccountSelector = By.css( '#loginAsAnotherUser' );
			await driverHelper.clickWhenClickable( driver, changeAccountSelector );
		}

		const userNameSelector = By.css( '#usernameOrEmail' );
		await driverHelper.waitTillPresentAndDisplayed( driver, userNameSelector );
		await driverHelper.setWhenSettable( driver, userNameSelector, username );
		// await this.driver.sleep( 1 );
		await driver.findElement( userNameSelector ).sendKeys( Key.ENTER );

		const passwordSelector = By.css( '#password' );
		await driverHelper.waitTillPresentAndDisplayed( driver, passwordSelector );
		await driverHelper.setWhenSettable( driver, passwordSelector, password, {
			secureValue: true,
		} );

		// await this.driver.sleep( 1 );
		await driver.findElement( passwordSelector ).sendKeys( Key.ENTER );
	}
}
