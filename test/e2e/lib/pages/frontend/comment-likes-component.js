/**
 * External dependencies
 */
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import AsyncBaseContainer from '../../async-base-container';
import CommentsAreaComponent from './comments-area-component';
import * as driverHelper from '../../driver-helper';

export default class CommentLikesComponent extends AsyncBaseContainer {
	constructor( driver, comment, url ) {
		super( driver, By.xpath( `//div[@class='comment-content']/p[.='${ comment }']` ), url );
		this.comment = comment;
	}

	static async PostComment( driver, comment ) {
		const commentArea = await CommentsAreaComponent.Expect( driver );

		await commentArea.reply( {
			comment: comment,
			name: 'e2eTestName',
			email: 'e2eTestName@test.com',
		} );

		return CommentLikesComponent.Expect( driver, comment );
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

	async likeComment() {
		const commentLikeLink = By.xpath(
			`//div[@class='comment-content']/p[.='${ this.comment }']/../p/a[@class='comment-like-link']`
		);
		await driverHelper.scrollIntoView( this.driver, commentLikeLink, 'end' );
		await driverHelper.clickWhenClickable( this.driver, commentLikeLink );
	}
	async expectLiked() {
		const commentLikedText = By.xpath(
			`//div[@class='comment-content']/p[.='${ this.comment }']/../p/span[starts-with(text(),'Liked by')]`
		);
		await driverHelper.waitTillPresentAndDisplayed( this.driver, commentLikedText );
	}
	async unlikeComment() {
		const commentUnLikeLink = By.xpath(
			`//div[@class='comment-content']/p[.='${ this.comment }']/../p[@class='comment-likes comment-liked']/a[@class='comment-like-link']`
		);
		await driverHelper.clickWhenClickable( this.driver, commentUnLikeLink );
	}
	async expectNotLiked() {
		const commentUnLikedText = By.xpath(
			`//div[@class='comment-content']/p[.='${ this.comment }']/../p/span[starts-with(text(),'Like')]`
		);
		await driverHelper.waitTillPresentAndDisplayed( this.driver, commentUnLikedText );
	}
}
