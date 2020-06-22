import React from 'react'
import { Link } from "react-router-dom"


class Home extends React.Component {

	state = { }


	constructor(props) {
		super(props)
	}

	componentDidUpdate() {
	}


	loginWithTwitter = async () => {
		try {

			console.log('loginWithTwitter')
			var provider = new window.firebase.auth.TwitterAuthProvider()
			// window.firebase.auth().signInWithRedirect(provider)

			let result = await window.firebase.auth().signInWithPopup(provider)

			console.log(result, result.user, result.credential)

			await this.props.appState.currentUserDoc.set({ twitterUsername: result.additionalUserInfo.username })


		} catch (error) {
			console.error(error.message || error);
		}
	}

	render() {
		return (
			<div class="container py-5" style={{ maxWidth: '40em' }}>
				<div class="h1 text-center my-4">💬 Social Exporter</div>

				<div class="lead text-center text-muted my-4">
					Export Your Followers
				</div>

				{this.props.appState.currentUser === undefined &&
					<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
				}
				{this.props.appState.currentUser === null &&
					<div class="text-center my-5 py-5">
						<button class="btn btn-dark px-5" onClick={this.loginWithTwitter}>Login with Twitter</button>
					</div>
				}

				{this.props.appState.currentUserData &&
					<div class="text-center my-5 py-5">
						<div class="small text-uppercase text-muted">Logged in as</div>
						<div class=" my-2">
							<img class="profile-pic mr-2 rounded-circle" src={this.props.appState.currentUser.photoURL} />
							{this.props.appState.currentUserData.twitterUsername}
						</div>
					</div>
				}




				<div class="text-center my-5">
				</div>

			</div>
		)
	}
}

export default Home
