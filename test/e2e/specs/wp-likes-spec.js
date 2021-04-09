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
import LoginPopup from '../lib/pages/login-popup-page.js';
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
	let accountKey = 'gutenbergSimpleSiteUser'; // eslint-disable-line prefer-const

	before( 'Start browser', async function () {
		this.timeout( startBrowserTimeoutMS );
		driver = await driverManager.startBrowser();
	} );

	describe( 'Like posts and comments @parallel', function () {
		beforeEach( 'Always start from the default frame', async function () {
			await driver.switchTo().defaultContent();
		} );

		step( 'Login, create a new post and view it', async function () {
			const loginFlow = new LoginFlow( driver, accountKey );
			await loginFlow.loginAndStartNewPost( null, true );

			const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
			await gEditorComponent.enterTitle( blogPostTitle );
			await gEditorComponent.enterText( blogPostQuote );
			postUrl = await gEditorComponent.publish( { visit: true } );
		} );

		// step( 'tofix: remove me', async function () {
		// 	accountKey = 'louisTestUser';
		// 	const loginFlow = new LoginFlow( driver, accountKey );
		// 	await loginFlow.login();

		// 	const iFrame = By.css( 'iframe.post-likes-widget' );
		// 	postUrl = 'https://c3polikes.blog/2021/04/07/awful-orcs-drink-hastily/';
		// 	const postLikesArea = new AsyncBaseContainer( driver, iFrame, postUrl );
		// 	await postLikesArea._visitInit();

		// 	await PostAreaComponent.Expect( driver );

		// 	// Unlike post if currently liked
		// 	await driver.switchTo().defaultContent();
		// 	await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );
		// 	await driverHelper.clickIfPresent( driver, By.css( '.liked.sd-button' ) );
		// } );

		step( 'Like post', async function () {
			await PostAreaComponent.Expect( driver );

			const likeButton = By.css( '.like.sd-button' );
			const iFrame = By.css( 'iframe.post-likes-widget' );
			await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );
			await driverHelper.scrollIntoView( driver, likeButton );
			await driverHelper.clickWhenClickable( driver, likeButton );

			const postLikedText = By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` );
			await driverHelper.waitTillPresentAndDisplayed( driver, postLikedText );
		} );

		step( 'Unlike post', async function () {
			const iFrame = By.css( 'iframe.post-likes-widget' );
			await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );

			const likedButton = By.css( '.liked.sd-button' );
			await driverHelper.scrollIntoView( driver, likedButton );
			await driverHelper.clickWhenClickable( driver, likedButton );

			const postLikedText = By.xpath(
				`//span[@class='wpl-count-text'][.='Be the first to like this.']`
			);
			await driverHelper.waitTillPresentAndDisplayed( driver, postLikedText );
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
			await driverHelper.scrollIntoView( driver, commentLikeLink, 'end' );
			await driverHelper.clickWhenClickable( driver, commentLikeLink );

			const commentLikedText = By.xpath(
				`//div[@class='comment-content']/p[.='${ comment }']/../p/span[starts-with(text(),'Liked by')]`
			);
			await driverHelper.waitTillPresentAndDisplayed( driver, commentLikedText );
		} );

		step( 'Unlike comment', async function () {
			const commentUnLikeLink = By.xpath(
				`//div[@class='comment-content']/p[.='${ comment }']/../p[@class='comment-likes comment-liked']/a[@class='comment-like-link']`
			);
			await driverHelper.clickWhenClickable( driver, commentUnLikeLink );

			const commentUnLikedText = By.xpath(
				`//div[@class='comment-content']/p[.='${ comment }']/../p/span[starts-with(text(),'Like')]`
			);
			await driverHelper.waitTillPresentAndDisplayed( driver, commentUnLikedText );
		} );

		step( 'Like post as logged out user', async function () {
			await driverManager.ensureNotLoggedIn( driver ); // Clear wpcom/calypso cookies
			await driverManager.clearCookiesAndDeleteLocalStorage( driver, postUrl ); // Clear test site cookies
			const remoteLoginUrl = 'https://r-login.wordpress.com/';
			await driverManager.clearCookiesAndDeleteLocalStorage( driver, remoteLoginUrl );

			const iFrame = By.css( 'iframe.post-likes-widget' );
			const postLikesArea = new AsyncBaseContainer( driver, iFrame, postUrl );
			await postLikesArea._visitInit();

			await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );

			const likeButton = By.css( '.like.sd-button' );
			await driverHelper.scrollIntoView( driver, likeButton );
			await driverHelper.clickWhenClickable( driver, likeButton );

			const account = dataHelper.getAccountConfig( accountKey );
			if ( ! account ) {
				throw new Error( `Account key '${ accountKey }' not found in the configuration` );
			}
			await LoginPopup.Login( driver, account[ 0 ], account[ 1 ] );

			// Frame switch required for xpath lookup to work
			await driverHelper.waitUntilAbleToSwitchToFrame( driver, iFrame );
			const postLikedText = By.xpath( `//span[@class='wpl-count-text'][.='You like this.']` );
			await driverHelper.waitTillPresentAndDisplayed( driver, postLikedText );
		} );
	} );
} );
