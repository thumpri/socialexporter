import React from 'react'
import { BrowserRouter, Switch, Route, Redirect, Link } from "react-router-dom"
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import './App.css'

function ScrollToTop() {
	const { pathname } = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return null;
}

const PrivateRoute = ({ component: Component, user, appState, ...rest }) => (
	<Route {...rest} render={(props) => (
		<div >
			{appState.currentUser === null &&
				<Redirect to={{
					pathname: '/login',
					state: { from: props.location }
				}} />
			}
			{appState.currentUser === undefined && <div class="my-5 py-5 text-center"><div class="spinner-border"></div></div>}
			{!!appState.currentUser && <Component {...props} appState={appState} />}
		</div>
	)} />
)

class App extends React.Component {

	state = {}

	componentDidMount() {
		window.firebase.auth().onAuthStateChanged(async (user) => {
			try {
				let state = {
					currentUser: user,
				}
				if (user) {
					state.currentUserDoc = window.firebase.firestore().collection('users').doc(user.uid)
					this.setState(state)
					let result = await state.currentUserDoc.get()
					state.currentUserData = result.data()
				}
				this.setState(state)
			} catch (error) {
				this.setState({})
			}
		});
	}

	render() {

		let privateRoutes = [
		]
		let routes = [
			// { path: '/login', component: require('./components/Login').default },
			{ path: '/:username', component: require('./components/User').default },
			{ path: '/', component: require('./components/Home').default },
		]

		return (
			<BrowserRouter>
				<ScrollToTop />
				<div>
					<Switch>
						{privateRoutes.map(r =>
							<PrivateRoute path={r.path} component={r.component} key={r.path} user={this.state.currentUser} appState={this.state} />
						)}
						{routes.map(r =>
							<Route path={r.path} key={r.path} render={(props) => (
								<r.component {...props} appState={this.state} />
							)} />
						)}
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}


export default App
