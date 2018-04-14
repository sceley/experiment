import React, { Component } from 'react';
import logo from '../logo.png';
export default class Logo extends Component {
	render () {
		return (
			<div className="Logo-wrap">
				<img className="logo" src={logo} alt="logo"/>
			</div>
		);
	}
}