import React from 'react'
import { Link } from "react-router-dom"

import * as FileSaver from 'file-saver'

import App from '../App'


class Home extends React.Component {

	state = {}


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
			await this.updateUserData(result)

		} catch (error) {
			console.error(error.message || error);
		}
	}
	updateUserData = async (result) => {
		let doc = App.currentUserDoc(result.user.uid)
		let snapshot = await doc.get()
		if (snapshot && snapshot.exists) {
			await App.currentUserDoc(result.user.uid).update({
				twitterUsername: result.additionalUserInfo.username,
				photoURL: result.user.photoURL,
			})
		}
		else {
			await App.currentUserDoc(result.user.uid).set({
				twitterUsername: result.additionalUserInfo.username,
				photoURL: result.user.photoURL,
				descriptionText: 'Submit your email to get signed up for my mailing list!',
			})
		}
	}
	logout = async (event) => {
		event.preventDefault()
		await window.firebase.auth().signOut()
	}


	exportFollowers = async (event) => {
		event.preventDefault()
		// todo: page through results

		let snapshot = await window.firebase.firestore().collection('followers').where('uid', '==', this.props.appState.currentUser.uid).get()
		let followers = snapshot.docs.map(doc => ({ ...doc.data(), _id: doc.id }))
		let emails = followers.map(f => f.followerEmail).filter((f, i, a) => !!f && a.indexOf(f) === i).join('\n')
		// console.log(emails)

		const blob = new Blob([emails], { type: 'text; charset=utf-8' })
		FileSaver.saveAs(blob, 'followers.txt')
	}


	render() {
		return (
			<div class="container py-5 max40" >
				<div class="h2 text-center my-4">💬 Social Exporter</div>

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
							<img class="profile-pic mr-2 rounded-circle" src={this.props.appState.currentUserData.photoURL} />
							{this.props.appState.currentUserData.twitterUsername}
						</div>

						<div class="small text-uppercase text-muted mt-5">Your public email sign up page</div>
						<div class="h5 my-2 overflow-auto">
							<Link to={'/' + this.props.appState.currentUserData.twitterUsername} target="_blank">{window.location.host + '/' + this.props.appState.currentUserData.twitterUsername}</Link>
						</div>
						<div class="small text-muted opacity-50 ">This is where your followers can submit their email to get signed up for your mailing list.</div>

						<div class="small font-weight-500 my-5">
							<a class="mx-2" href="#" onClick={this.exportFollowers}>Export Followers</a>
							<Link class=" mx-2" to={"/" + this.props.appState.currentUserData.twitterUsername + "/leaderboard"}>Leaderboard</Link>
							<Link class=" mx-2" to="/settings">Settings</Link>
							<a class="mx-2" href="#" onClick={this.logout}>Logout</a>
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
