import React, { Component } from 'react';
import { Menu, Layout, Icon, Button, message } from 'antd';
import { Route, Link } from 'react-router-dom';
import Header_c from '../../common/Header';
import Logo from '../../common/Logo';
import Info from './Info';
import Reserve from './Reserve';
import MyReserve from './MyReserve';
import logo from './logo.png';
import './User.css';
const { Sider, Content, Header } = Layout;

export default class Person extends Component {
	state={
		current: 'info'
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
	}
	handleBack = () => {
		this.setState({
			current: 'info'
		});
	}
	render () {
		return (
			<div className="Person">
				<Layout>
					<Sider width={256} className="Person-sider">
						<Link onClick={this.handleBack} to={`${this.props.match.url}`}><Logo /></Link>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							theme="dark"
						>
							<Menu.Item key="info">
								<Link to={`${this.props.match.url}`}>
									<Icon type="profile" />信息编辑
								</Link>
							</Menu.Item>
							<Menu.Item key="reserve">
								<Link to={`${this.props.match.url}/reserve`}>
									<Icon type="form" />在线预约
								</Link>
							</Menu.Item>
							<Menu.Item key="myreserve">
								<Link to={`${this.props.match.url}/myreserve`}>
									<Icon type="table" />我的预约
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Content>
						<Layout>
							<Header_c handleLogout={this.handleLogout}/>
							<Content className="Person-body">
								<Route exact path={`${this.props.match.url}`} component={Info}/>
								<Route path={`${this.props.match.url}/reserve`} component={Reserve}/>
								<Route path={`${this.props.match.url}/myreserve`} component={MyReserve}/>
							</Content>
						</Layout>
					</Content>
				</Layout>
			</div>
		);
	}
};