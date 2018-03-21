import React, { Component } from 'react';
import logo from './logo.png';
export default class HeaderForLog extends Component {
	render () {
		return (
			<div className="HeaderForLog">
				<img className="logo" src={logo}/>
				<span>实验室管理系统</span>
			</div>
		);
	}
}