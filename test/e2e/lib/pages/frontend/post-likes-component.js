/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverHelper from '../../driver-helper';
import AsyncBaseContainer from '../../async-base-container';

export default class PostLikesComponent extends AsyncBaseContainer {
	constructor( driver, url ) {
		super( driver, By.css( 'iframe.post-likes-widget' ), url );
	}

	async _preInit() {
		await this.driver.switchTo().defaultContent();
	}

	async clickLike() {
		await this.driver.switchTo().defaultContent();
		await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
		const likeButton = By.css( '.like.sd-button' );
		await driverHelper.scrollIntoView( this.driver, likeButton );
		await driverHelper.clickWhenClickable( this.driver, likeButton );
		await this.driver.switchTo().defaultContent();
	}

	async expectLiked() {
		await this.driver.switchTo().defaultContent();
		await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
		await driverHelper.waitTillPresentAndDisplayed(
			this.driver,
			By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` )
		);
		await this.driver.switchTo().defaultContent();
	}

	async clickUnlike() {
		await this.driver.switchTo().defaultContent();
		await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
		const likedButton = By.css( '.liked.sd-button' );
		await driverHelper.scrollIntoView( this.driver, likedButton );
		await driverHelper.clickWhenClickable( this.driver, likedButton );
		await this.driver.switchTo().defaultContent();
	}

	async expectNotLiked() {
		await this.driver.switchTo().defaultContent();
		await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
		await driverHelper.waitTillPresentAndDisplayed(
			this.driver,
			By.xpath( `//span[@class='wpl-count-text'][.='Be the first to like this.']` )
		);
		await this.driver.switchTo().defaultContent();
	}
}
