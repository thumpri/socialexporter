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
					pathname: '/',
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

	static currentUserDoc = (uid) => window.firebase.firestore().collection('users').doc(uid)

	componentDidMount() {
		window.firebase.auth().onAuthStateChanged(async (user) => {
			try {
				this.setState({
					currentUser: user,
					currentUserData: undefined,
				})
				if (user) {
					App.currentUserDoc(user.uid).onSnapshot(doc => {
						this.setState({ currentUserData: doc.data() })
					})
				}
			} catch (error) {
				this.setState({})
			}
		});
	}

	render() {

		let privateRoutes = [
			{ path: '/settings', component: require('./components/UserSettings').default },
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
