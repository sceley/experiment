import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Notifications from '../../common/Notifications';
import UserLogin from '../User/Login';
import UserLogup from '../User/Logup';
import FillingInfo from '../User/FillingInfo';
import AdminLogin from '../Admin/Login';
import User from '../User/User';
import Admin from '../Admin/Admin';

export default class Home extends Component {
	render () {
		return (
			<div className="Home">
				<Switch>
					<Route path={`${this.props.match.url}user/login`} component={UserLogin}/>
					<Route path={`${this.props.match.url}user/logup`} component={UserLogup} />
					<Route path={`${this.props.match.url}admin/login`} component={AdminLogin} />
					<Route path={`${this.props.match.url}user/fillinginfo`} component={FillingInfo}/>
					<Route path={`${this.props.match.url}user`} component={User} />
					<Route path={`${this.props.match.url}admin`} component={Admin} />
				</Switch>
				<Notifications/>
			</div>
		);
	}
}