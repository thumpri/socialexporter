import React from 'react';
import { Link } from "react-router-dom"


class Login extends React.Component {

	constructor(props) {
		super(props);
		this.state = { mode: 'signup' };

		this.email = React.createRef();
		this.password = React.createRef();
	}

	handleSubmit = async (event) => {
		event.preventDefault()
		console.log(this.email.current.value, this.password.current.value)

		try {

			this.setState({ error: null })

			if (this.state.mode == 'login') {
				let result = await window.firebase.auth().signInWithEmailAndPassword(this.email.current.value, this.password.current.value)
				console.log(result.user)
			}
			if (this.state.mode == 'signup') {
				let result = await window.firebase.auth().createUserWithEmailAndPassword(this.email.current.value, this.password.current.value)
				console.log(result.user)
			}

			let { from } = this.props.location.state || { from: { pathname: "/" } };
			this.props.history.replace(from);

		} catch (e) {
			console.log(e.message || e);
			this.setState({ error: e.message || e })
		}
	}

	switchMode(event,mode) {
		event.preventDefault()
		console.log(mode);
		this.setState({ mode:mode })
	}


	render() {
		return (
		<div class="container my-5">
			<div class="h1 text-center my-5 py-5"><Link to="/" class="text-reset text-decoration-none">💬 Social Exporter</Link></div>

			<form onSubmit={this.handleSubmit} class="mx-auto" style={{maxWidth:'20em'}}>

				<div class="form-group">
					<label htmlFor="email" class="small text-uppercase text-muted">Email address</label>
					<input type="email" class="form-control" id="email" ref={this.email} />
				</div>
				<div class="form-group">
					<label htmlFor="password" class="small text-uppercase text-muted">Password</label>
					<input type="password" class="form-control" id="password" ref={this.password} />
				</div>

				<div class="small text-danger text-center my-4 ">{this.state.error}</div>
				<div class=" my-4">
					<button type="submit" class="btn btn-dark btn-block text-capitalize">{this.state.mode=='login'?'Log In':'Sign Up'}</button>
				</div>

				<div class="text-center">
					{(this.state.mode == 'login' && <a href="" class="small" onClick={(e) => this.switchMode(e,'signup')}>Sign Up</a>)}
					{(this.state.mode == 'signup' && <a href="" class="small" onClick={(e) => this.switchMode(e,'login')}>Log In</a>)}
				</div>

			</form>


		</div>
		)
	}


}

export default Login
