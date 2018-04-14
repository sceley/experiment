import React, { Component } from 'react';
import { Menu, Layout, Icon, Avatar } from 'antd';
import { Route, Link } from 'react-router-dom';
import Header from '../../common/Header';
import Logo from '../../common/Logo';
import Setting from './Setting';
import Reserve from './Reserve';
import MyReserve from './MyReserve';
import Feedback from './Feedback';
import Message from './Message';
import config from '../../config';
const { Sider, Content } = Layout;

export default class User extends Component {
	state={
		current: 'myreserve',
		user: ''
	}
	handleClick = (e) => {
		this.setState({
			current: e.key
		});
	}
	handleLogout = () => {
		delete localStorage.user_token
		this.props.history.push('/user/login');
	}
	componentWillMount = () => {
		if (!localStorage.user_token) {
			this.props.history.push('/user/login');
		}
		fetch(`${config.server}/api/user/info`, {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					user: json.user
				});
			}
		});
	}
	handleBack = () => {
		this.setState({
			current: 'myreserve'
		});
	}
	handleSetting = () => {
		this.setState({
			current: ''
		});
	}
	render () {
		return (
			<div className="Person">
				<Layout>
					<Sider style={{minHeight: '100vh'}} width={256} className="Sider-shadow">
						<Link onClick={this.handleBack} to={`${this.props.match.url}`}><Logo /></Link>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							theme="dark"
						>
							<Menu.Item key="myreserve">
								<Link to={`${this.props.match.url}`}>
									<Icon type="table" />我的预约
								</Link>
							</Menu.Item>
							<Menu.Item key="reserve">
								<Link to={`${this.props.match.url}/reserve`}>
									<Icon type="form" />在线预约
								</Link>
							</Menu.Item>
							<Menu.Item key="message">
								<Link to={`${this.props.match.url}/feedback/reply`}>
									<Icon type="message" />消息通知
								</Link>
							</Menu.Item>
							<Menu.Item key="feedback">
								<Link to={`${this.props.match.url}/feedback`}>
									<Icon type="edit" />我要反馈
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Content>
						<Layout>
							<Header
								handleLogout={this.handleLogout}
								setting={
									<Link onClick={this.handleSetting} className="link-wrap" to={`${this.props.match.url}/setting`}>
										<Avatar shape="square" icon="user" />
										<span>{this.state.user.name}</span>
									</Link>
								}
							/>
							<Content>
								<Route exact path={`${this.props.match.url}`} component={MyReserve}/>
								<Route path={`${this.props.match.url}/setting`} component={Setting}/>
								<Route path={`${this.props.match.url}/reserve`} component={Reserve}/>
								<Route exact path={`${this.props.match.url}/feedback`} component={Feedback}/>
								<Route path={`${this.props.match.url}/feedback/reply`} component={Message} />
							</Content>
						</Layout>
					</Content>
				</Layout>
			</div>
		);
	}
};