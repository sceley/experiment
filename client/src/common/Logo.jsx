import React, { Component } from 'react';
import logo from './logo.png';
import './Logo.css';
export default class Logo extends Component {
	render () {
		return (
			<div className="Logo">
				<img className="logo" src={logo}/>
				<span>实验室管理系统</span>
			</div>
		);
	}
}