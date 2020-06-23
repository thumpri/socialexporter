import React from 'react';
import { Link } from "react-router-dom"

import App from '../App'


class UserSettings extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.descriptionText = React.createRef()
	}


	handleSubmit = async (event) => {
		event.preventDefault()
		console.log(this.descriptionText.current.value)

		try {
			this.setState({ error: null })

			if (!this.descriptionText.current.value) throw 'Please enter a description text'

			await App.currentUserDoc(this.props.appState.currentUser.uid).update({
				descriptionText: this.descriptionText.current.value,
			})

			this.props.history.push('/')

		} catch (e) {
			console.log(e.message || e);
			this.setState({ error: e.message || e })
		}
	}



	render() {
		return (
			<div class="container py-5">
				<div class="h6 text-center my-5 "><Link to="/" class="text-reset text-decoration-none">💬 Social Exporter</Link></div>

				{this.props.appState.currentUserData === undefined &&
					<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
				}

				{this.props.appState.currentUserData &&
					<div>

						<div class="h3 text-center my-5 ">
							<img class="profile-pic mr-2 rounded-circle" src={this.props.appState.currentUserData.photoURL} />
							{this.props.appState.currentUserData.twitterUsername}
						</div>


						<div class="py-2">
						</div>

						<form onSubmit={this.handleSubmit} class="my-5  max20">
							<div class="form-group">
								<label htmlFor="descriptionText" class="small text-uppercase text-muted">Description Text</label>
								<textarea type="text" class="form-control" id="descriptionText" rows="3" ref={this.descriptionText} defaultValue={this.props.appState.currentUserData.descriptionText} />
							</div>

							<div class="small text-danger text-center my-4 ">{this.state.error}</div>
							<div class=" my-4">
								<button type="submit" class="btn btn-dark btn-block text-capitalize">Save</button>
							</div>
						</form>

						
					</div>
				}


			</div>
		)
	}


}

export default UserSettings
