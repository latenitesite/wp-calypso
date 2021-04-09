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
import PostLikesComponent from '../lib/pages/frontend/post-likes-component';
import CommentsAreaComponent from '../lib/pages/frontend/comments-area-component';
import GutenbergEditorComponent from '../lib/gutenberg/gutenberg-editor-component';

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
			await await driver.switchTo().defaultContent();
		} );

		step( 'Login, create a new post and view it', async function () {
			if ( process.env.NODE_CONFIG_ENV !== 'decrypted' ) {
				const loginFlow = new LoginFlow( driver, accountKey );
				await loginFlow.loginAndStartNewPost( null, true );

				const gEditorComponent = await GutenbergEditorComponent.Expect( driver );
				await gEditorComponent.enterTitle( blogPostTitle );
				await gEditorComponent.enterText( blogPostQuote );
				postUrl = await gEditorComponent.publish( { visit: true } );
			} else {
				// tofix: remove this section
				accountKey = 'louisTestUser';
				const loginFlow = new LoginFlow( driver, accountKey );
				await loginFlow.login();

				postUrl = 'https://c3polikes.blog/2021/04/07/awful-orcs-drink-hastily/';
				const postLikes = await PostLikesComponent.Visit( driver, postUrl );
				try {
					await postLikes.clickUnlike();
				} catch ( e ) {
					console.log( e );
				}
			}
		} );

		step( 'Like post', async function () {
			const postLikes = await PostLikesComponent.Expect( driver );
			await postLikes.clickLike();
			await postLikes.expectLiked();
		} );

		step( 'Unlike post', async function () {
			const postLikes = await PostLikesComponent.Expect( driver );
			await postLikes.clickUnlike();
			await postLikes.expectNotLiked();
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
			await driverManager.ensureNotLoggedIntoSite( driver, postUrl );

			const postLikes = await PostLikesComponent.Visit( driver, postUrl );
			await postLikes.clickLike();

			const loginFlow = new LoginFlow( driver, accountKey );
			await loginFlow.loginUsingPopup();

			await postLikes.expectLiked();
		} );
	} );
} );
