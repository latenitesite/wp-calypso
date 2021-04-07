/**
 * External dependencies
 */
import config from 'config';
import { By } from 'selenium-webdriver';

/**
 * Internal dependencies
 */
import * as driverManager from '../lib/driver-manager';
import * as dataHelper from '../lib/data-helper';
import * as driverHelper from '../lib/driver-helper';
import LoginFlow from '../lib/flows/login-flow';
import PostAreaComponent from '../lib/pages/frontend/post-area-component';
import CommentsAreaComponent from '../lib/pages/frontend/comments-area-component';
import GutenbergEditorComponent from '../lib/gutenberg/gutenberg-editor-component';
import AsyncBaseContainer from '../lib/async-base-container';

const host = dataHelper.getJetpackHost();
const screenSize = driverManager.currentScreenSize();
const startBrowserTimeoutMS = config.get( 'startBrowserTimeoutMS' );
const mochaTimeoutMS = config.get( 'mochaTimeoutMS' );
const blogPostTitle = dataHelper.randomPhrase();
const blogPostQuote =
	'The foolish man seeks happiness in the distance. The wise grows it under his feet.\n— James Oppenheim';

describe( `[${ host }] Likes: (${ screenSize })`, function () {
	let driver;
	let postUrl;
	this.timeout( mochaTimeoutMS );
	const comment = dataHelper.randomPhrase();

	before( 'Start browser', async function () {
		this.timeout( startBrowserTimeoutMS );
		driver = await driverManager.startBrowser();
	} );

	describe( 'Like posts and comments @parallel', function () {
		step( 'Login, create a new post and view it', async function () {
			await new LoginFlow( driver, 'gutenbergSimpleSiteUser' ).loginAndStartNewPost( null, true );

			const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
			await gEditorComponent.enterTitle( blogPostTitle );
			await gEditorComponent.enterText( blogPostQuote );
			postUrl = await gEditorComponent.publish( { visit: true } );
		} );

		step( 'Like post', async function () {
			await PostAreaComponent.Expect( driver );

			const likeButton = By.css( '.like.sd-button' );
			const iFrame = By.css( 'iframe.post-likes-widget' );
			await driver.switchTo().defaultContent();
			await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );
			await driverHelper.scrollIntoView( driver, likeButton );
			await driverHelper.clickWhenClickable( driver, likeButton );

			const postLikedText = By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` );
			await driverHelper.waitTillPresentAndDisplayed( driver, postLikedText );
			await driver.switchTo().defaultContent();
		} );

		step( 'Post and like comment', async function () {
			const commentArea = await CommentsAreaComponent.Expect( driver );

			await commentArea._postComment( {
				comment: comment,
				name: 'e2eTestName',
				email: 'e2eTestName@test.com',
			} );

			const commentLikeLink = By.xpath(
				`//div[@class='comment-content']/p[.='${ comment }']/../p/a[@class='comment-like-link']`
			);
			await driver.switchTo().defaultContent();
			await driverHelper.scrollIntoView( driver, commentLikeLink, 'end' );
			await driverHelper.clickWhenClickable( driver, commentLikeLink );

			const commentLikedText = By.xpath(
				`//div[@class='comment-content']/p[.='${ comment }']/../p/span[starts-with(text(),'Liked by')]`
			);
			await driverHelper.waitTillPresentAndDisplayed( driver, commentLikedText );
		} );

		describe( 'Like from logged out', function () {
			step( 'Like post as logged out user', async function () {
				const iFrame = By.css( 'iframe.post-likes-widget' );
				const postLikesArea = new AsyncBaseContainer( driver, iFrame, postUrl );
				postLikesArea._visitInit();

				await driver.switchTo().defaultContent();
				await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );

				const likeButton = By.css( '.like.sd-button' );
				await driverHelper.scrollIntoView( driver, likeButton );
				await driverHelper.clickWhenClickable( driver, likeButton );

				const postLikedText = By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` );
				await driverHelper.waitTillPresentAndDisplayed( driver, postLikedText );
				await driver.switchTo().defaultContent();
			} );
		} );
	} );
} );
