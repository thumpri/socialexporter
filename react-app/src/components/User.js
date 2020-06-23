import React from 'react';
import { Link } from "react-router-dom"


class User extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.email = React.createRef();
	}

	async componentDidMount() {
		try {
			let snapshot = await window.firebase.firestore().collection('users').where('twitterUsername', '==', this.props.match.params.username).get()
			let userData = snapshot.docs[0].data()
			userData.uid = snapshot.docs[0].id
			// console.log(userData);
			this.setState({ userData: userData })

		} catch (error) {
			console.error(error.message || error);
			this.setState({ userData: null })
		}
	}

	handleSubmit = async (event) => {
		event.preventDefault()
		console.log(this.email.current.value)

		try {
			this.setState({ error: null })

			if (!this.email.current.value) throw 'Please enter an email'

			let docRef = await window.firebase.firestore().collection('followers').add({
				uid: this.state.userData.uid,
				twitterUsername: this.state.userData.twitterUsername,
				followerEmail: this.email.current.value,
			})
			console.log(docRef.id);

			this.setState({ followerId: docRef.id })


		} catch (e) {
			console.log(e.message || e);
			this.setState({ error: e.message || e })
		}
	}



	render() {
		return (
			<div class="container py-5">
				<div class="h6 text-center my-5 "><Link to="/" class="text-reset text-decoration-none">💬 Social Exporter</Link></div>

				{this.state.userData === undefined &&
					<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
				}
				{this.state.userData === null &&
					<div class="text-center  my-5 p-5  max20 mx-auto">
						<div class="h3">🧐</div>
						<div class="text-muted text-uppercase small">Unknown User</div>
					</div>
				}

				{this.state.userData &&
					<div>

						<div class="h3 text-center my-5 ">
							<img class="profile-pic mr-2 rounded-circle" src={this.state.userData.photoURL} />
							{this.state.userData.twitterUsername}
						</div>

						{this.state.userData.descriptionText &&
							<div class="text-center text-muted my-5 max40">
								{this.state.userData.descriptionText}
							</div>
						}

						<div class="py-2">
						</div>

						{!this.state.followerId &&
							<form onSubmit={this.handleSubmit} class="my-5  max20">

								<div class="form-group">
									<label htmlFor="email" class="small text-uppercase text-muted">Email address</label>
									<input type="email" class="form-control" id="email" ref={this.email} />
								</div>

								<div class="small text-danger text-center my-4 ">{this.state.error}</div>
								<div class=" my-4">
									<button type="submit" class="btn btn-dark btn-block text-capitalize">Sign Up</button>
								</div>
							</form>
						}

						{this.state.followerId &&
							<div class="text-center  my-5 p-3 bg-light max20">
								<div class="h3">👍</div>
								<div class="text-muted">Your email has been submitted</div>
							</div>
						}
					</div>
				}


			</div>
		)
	}


}

export default User
