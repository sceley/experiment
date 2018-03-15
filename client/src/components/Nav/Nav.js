import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Modal } from 'antd';
import logo from './logo.png';
import Login from '../Login/Login';
import Logup from '../Logup/Logup';
import './Nav.css';

export default class Nav extends Component {
	state = {
		login_visible: false,
		logup_visible: false,
		current: 'home',
		login: false
	}
	show_login_modal = () => {
		this.setState({
			login_visible: true
		});
	}
	show_logup_modal = () => {
		this.setState({
			logup_visible: true
		});
	}
	hidden_login_modal = () => {
		this.setState({
			login_visible: false
		});
	}
	hidden_logup_modal = () => {
		this.setState({
			logup_visible: false
		});
	}
	handleClick = (e) => {
		this.setState({
			current: e.key
		});
	}
	likeTH = () => {
		this.setState({
			current: 'home'
		});
	}
	logout = () => {
		localStorage.token = null;
		this.setState({
			login: false
		});
	}
	componentWillMount = () => {
		let token = localStorage.token;
		if (token) {
			this.setState({
				login: true
			});
		}
	}
	render () {
		return (
			<div className="Nav">
				<div onClick={this.likeTH} className="nav-left">
					<Link to="/">
						<img className="logo" src={logo} alt="logo"/>
					</Link>
				</div>
				<div className="nav-center">
					<Menu
						className="menu"
				        theme="dark"
				        mode="horizontal"
				        onClick={this.handleClick}
				        selectedKeys={[this.state.current]}
				        style={{ lineHeight: '64px' }}
			      	>
			      		<Menu.Item key="home">
			      			<Link to="/">首页</Link>
			      		</Menu.Item>
						<Menu.Item key="person">
							<Link to="/person">个人中心</Link>
						</Menu.Item>
						<Menu.Item key="admin">
							<Link to="/admin">管理中心</Link>
						</Menu.Item>
						<Menu.Item key="evaluation">
							<Link to="/evaluation">预约评价</Link>
						</Menu.Item>
					</Menu>
				</div>
				<div className="nav-right">
					{
						this.state.login?
						<ul className="log">
							<li>
								<a onClick={this.logout}>退出</a>
							</li>
						</ul>
						:
						<ul className="log">
							<li>
								<a onClick={this.show_login_modal}>登录</a>
							</li>
							<li>
								<a onClick={this.show_logup_modal}>注册</a>
							</li>
						</ul>
					}
				</div>
				<Modal
					visible={this.state.login_visible}
					onCancel={this.hidden_login_modal}
					footer={null}
					closable={false}
					bodyStyle={{padding: 0}}
					width={350}
				>
					<Login/>
				</Modal>
				<Modal
					visible={this.state.logup_visible}
					onCancel={this.hidden_logup_modal}
					footer={null}
					width={350}
					bodyStyle={{padding: 0}}
					closable={false}
					>
					<Logup/>
				</Modal>
			</div>
		);
	}
}
