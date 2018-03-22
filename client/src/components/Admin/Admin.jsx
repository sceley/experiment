import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { Menu, Layout, message } from 'antd';
import Header_c from '../../common/Header';
import Logo from '../../common/Logo';
import MonitorExp from './MonitorExp';
import MonitorUser from './MonitorUser';
import MonitorReserve from './MonitorReserve';
// import AddExp from './AddExp';
import Exps from './Exps';
import Notify from './Notify';
import './Admin.css';
const { Sider, Content } = Layout;

export default class Admin extends Component {
	state = {
		current: 'monitorexp'
	}
	handleClick = (e) => {
		this.setState({
			current: e.key
		});
	}
	handleLogout = () => {
		delete localStorage.admin_token;
		this.props.history.push('/admin/login');
	}
	componentWillMount = () => {
		if (!localStorage.admin_token) {
			message.error('请先进行登陆');
			this.props.history.push('/admin/login');
		}
	}
	render () {
		return (
			<div className="Admin">
				<Layout>
					<Sider width={256}>
						<Logo/>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							theme="dark"
						>
							<Menu.Item key="monitorexp">
								<Link to={`${this.props.match.url}`}>
									实验室监控
								</Link>
							</Menu.Item>
							<Menu.Item key="user">
								<Link to={`${this.props.match.url}/user`}>
									用户管理
								</Link>
							</Menu.Item>
							<Menu.Item key="reserve">
								<Link to={`${this.props.match.url}/reserve`}>
									预约管理
								</Link>
							</Menu.Item>
							<Menu.Item key="exps">
								<Link to={`${this.props.match.url}/exps`}>
									我的实验室
								</Link>
							</Menu.Item>
							<Menu.Item key="notify">
								<Link to={`${this.props.match.url}/notify`}>
									发布公告
								</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Content>
						<Layout>
							<Header_c handleLogout={this.handleLogout}/>
							<Content>
								<Route exact path={`${this.props.match.url}`} component={MonitorExp} />
								<Route path={`${this.props.match.url}/user`} component={MonitorUser}/>
								<Route path={`${this.props.match.url}/reserve`} component={MonitorUser}/>
								<Route path={`${this.props.match.url}/notify`} component={Notify}/>
								<Route path={`${this.props.match.url}/exps`} component={Exps}/>
							</Content>
						</Layout>
					</Content>
				</Layout>
			</div>
		);
	}
}