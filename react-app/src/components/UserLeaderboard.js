import React from 'react';
import { Link } from "react-router-dom"


class UserLeaderboard extends React.Component {

	constructor(props) {
		super(props);
		this.state = {};

		this.email = React.createRef();
	}

	async componentDidMount() {
		try {
			let snapshot = await window.firebase.firestore().collection('users').where('twitterUsername', '==', this.props.match.params.username).get()
			if (snapshot.docs.length == 0) throw 'Unknown User'

			let userData = snapshot.docs[0].data()
			userData.uid = snapshot.docs[0].id
			// console.log(userData);
			this.setState({ userData: userData })

			let result = await window.firebase.functions().httpsCallable('userLeaderboard')({ uid: userData.uid })
			console.log(result.data)
			this.setState({ followers: result.data })

		} catch (error) {
			console.error(error.message || error);
			this.setState({ userData: null, error: error.message || error })
		}
	}

	render() {
		return (
			<div class="container py-5">
				<div class="h6 text-center my-5 "><Link to="/" class="text-reset text-decoration-none">💬 Social Exporter</Link></div>

				{this.state.userData === undefined &&
					<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
				}
				{this.state.error &&
					<div class="text-center  my-5 p-5  max20 mx-auto">
						<div class="h3">🧐</div>
						<div class="text-muted text-uppercase small">{this.state.error}</div>
					</div>
				}

				{this.state.userData &&
					<div class="max40">

						<div class="h3 text-center my-5 ">
							<img class="profile-pic mr-2 rounded-circle" src={this.state.userData.photoURL} />
							{this.state.userData.twitterUsername}
						</div>

						<div class="py-2">
						</div>

						{!this.state.followers &&
							<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
						}
						{this.state.followers && this.state.followers.length == 0 &&
							<div class="my-5 py-5 text-center small text-uppercase text-muted">No referrals yet</div>
						}
						{this.state.followers && this.state.followers.length > 0 &&
							<div>
								<div class="small text-muted text-center text-uppercase my-5">Referral Leaderboard</div>
								<table class="table table-borderless">
									<tbody>
										{this.state.followers.map(f =>
											<tr key={f.followerId}>
												<td class="text-monospace">{f.followerId}</td>
												<td class="">{f.followerEmail}</td>
												<td class="text-right">{f.referralCount}</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>
						}

					</div>
				}

			</div>
		)
	}


}

export default UserLeaderboard
