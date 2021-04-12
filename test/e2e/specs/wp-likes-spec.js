/**
 * External dependencies
 */
import config from 'config';

/**
 * Internal dependencies
 */
import * as driverManager from '../lib/driver-manager';
import * as dataHelper from '../lib/data-helper';
import LoginFlow from '../lib/flows/login-flow';
import PostLikesComponent from '../lib/pages/frontend/post-likes-component';
import GutenbergEditorComponent from '../lib/gutenberg/gutenberg-editor-component';
import CommentLikesComponent from '../lib/pages/frontend/comment-likes-component';
import { step } from 'mocha-steps';

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

		step( 'Like comment', async function () {
			const commentLikes = await CommentLikesComponent.PostComment( driver, comment );
			await commentLikes.likeComment();
			await commentLikes.expectLiked();
		} );

		step( 'Unlike comment', async function () {
			const commentLikes = await CommentLikesComponent.Expect( driver, comment );
			await commentLikes.unlikeComment();
			await commentLikes.expectNotLiked();
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
