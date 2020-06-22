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

const PrivateRoute = ({ component: Component, user, ...rest }) => (
	<Route {...rest} render={(props) => (
		<div >
			{user === null &&
				<Redirect to={{
					pathname: '/login',
					state: { from: props.location }
				}} />
			}
			{user === undefined && <div class="my-5 py-5 text-center"><div class="spinner-border"></div></div>}
			{!!user && <Component {...props} user={user} />}
		</div>
	)} />
)

class App extends React.Component {

	state = {}

	componentDidMount() {
		window.firebase.auth().onAuthStateChanged((user) => {
			this.setState({ currentUser: user })
		});
	}

	render() {

		let privateRoutes = [

		]
		let routes = [
			{ path: '/login', component: require('./components/Login').default },
			{ path: '/', component: require('./components/Home').default },
		]

		return (
			<BrowserRouter>
				<ScrollToTop />
				<div>
					<Switch>
						{privateRoutes.map(r =>
							<PrivateRoute path={r.path} component={r.component} key={r.path} user={this.state.currentUser} />
						)}
						{routes.map(r =>
							<Route path={r.path}  key={r.path} user={this.state.currentUser} render={(props) => (
								<r.component {...props} user={this.state.currentUser} />
							)} />
						)}
					</Switch>
				</div>
			</BrowserRouter>
		)
	}
}


export default App
