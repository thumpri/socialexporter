import React from 'react'
import { Link } from "react-router-dom"


class Home extends React.Component {

	state = { currentUser: null }


	constructor(props) {
		super(props)
	}

	componentDidMount() {
	}

	render() {
		return (
			<div class="container py-5" style={{ maxWidth: '40em' }}>
				<div class="h1 text-center my-5">💬 Social Exporter</div>

				<div class="lead text-center text-muted my-5">
				</div>

				{this.props.user === undefined &&
					<div class="my-5 py-5 text-center"><div class="spinner-border spinner-border-sm"></div></div>
				}
				{this.props.user === null &&
					<div class="text-center my-5 py-5">
						<Link to="/login" class="btn btn-lg btn-dark px-5">Sign Up</Link>
					</div>
				}

				{this.props.user &&
					<div class="text-center my-5 p-3 bg-light rounded">
						<div class="small text-muted my-2">Logged in as {this.props.user.email}</div>
					</div>
				}




				<div class="text-center my-5">
				</div>

			</div>
		)
	}
}

export default Home
