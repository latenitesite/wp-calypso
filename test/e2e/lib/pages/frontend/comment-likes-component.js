/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
// import * as driverHelper from '../../driver-helper';
import AsyncBaseContainer from '../../async-base-container';

export default class CommentLikesComponent extends AsyncBaseContainer {
	constructor( driver, comment, url ) {
		super( driver, By.xpath( `//div[@class='comment-content']/p[.='${ comment }']` ), url );
		this.comment = comment;
	}

	static async Expect( driver, comment ) {
		const page = new this( driver, comment );
		await page._expectInit();
		return page;
	}

	static async Visit( driver, comment, url ) {
		const page = new this( driver, comment, url );
		await page._visitInit();
		return page;
	}

	async likeComment() {}
	async unlikeComment() {}
	async expectLiked() {}
	async expectUnliked() {}

	// step( 'Post and like comment', async function () {

	// 	const commentLikeLink = By.xpath(
	// 		`//div[@class='comment-content']/p[.='${ comment }']/../p/a[@class='comment-like-link']`
	// 	);
	// 	await driverHelper.scrollIntoView( driver, commentLikeLink, 'end' );
	// 	await driverHelper.clickWhenClickable( driver, commentLikeLink );

	// 	const commentLikedText = By.xpath(
	// 		`//div[@class='comment-content']/p[.='${ comment }']/../p/span[starts-with(text(),'Liked by')]`
	// 	);
	// 	await driverHelper.waitTillPresentAndDisplayed( driver, commentLikedText );
	// } );

	// step( 'Unlike comment', async function () {
	// 	const commentUnLikeLink = By.xpath(
	// 		`//div[@class='comment-content']/p[.='${ comment }']/../p[@class='comment-likes comment-liked']/a[@class='comment-like-link']`
	// 	);
	// 	await driverHelper.clickWhenClickable( driver, commentUnLikeLink );

	// 	const commentUnLikedText = By.xpath(
	// 		`//div[@class='comment-content']/p[.='${ comment }']/../p/span[starts-with(text(),'Like')]`
	// 	);
	// 	await driverHelper.waitTillPresentAndDisplayed( driver, commentUnLikedText );
	// } );

	// todo

	// async clickLike() {
	// 	await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );

	// 	const likeButton = By.css( '.like.sd-button' );
	// 	await driverHelper.scrollIntoView( this.driver, likeButton );
	// 	await driverHelper.clickWhenClickable( this.driver, likeButton );

	// 	await this.driver.switchTo().defaultContent();
	// }

	// async expectLiked() {
	// 	await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
	// 	await driverHelper.waitTillPresentAndDisplayed(
	// 		this.driver,
	// 		By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` )
	// 	);
	// 	await this.driver.switchTo().defaultContent();
	// }

	// async clickUnlike() {
	// 	await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
	// 	const likedButton = By.css( '.liked.sd-button' );
	// 	await driverHelper.scrollIntoView( this.driver, likedButton );
	// 	await driverHelper.clickWhenClickable( this.driver, likedButton );
	// 	await this.driver.switchTo().defaultContent();
	// }

	// async expectNotLiked() {
	// 	await driverHelper.waitUntilAbleToSwitchToFrame( this.driver, this.expectedElementSelector );
	// 	await driverHelper.waitTillPresentAndDisplayed(
	// 		this.driver,
	// 		By.xpath( `//span[@class='wpl-count-text'][.='Be the first to like this.']` )
	// 	);
	// 	await this.driver.switchTo().defaultContent();
	// }
}
