import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { Route, Link } from 'react-router-dom';
import Info from './Info';
import Reserve from './Reserve';
import './Person.css';
const { Sider, Content } = Layout;

export default class Person extends Component {
	state={
		current: 'info'
	}
	handleClick = (e) => {
		this.setState({
			current: e.key
		});
	}
	render () {
		return (
			<div className="Person">
				<Layout>
					<Sider>
						<Menu
							onClick={this.handleClick}
							selectedKeys={[this.state.current]}
							mode="inline"
							theme="dark"
						>
							<Menu.Item key="info">
								<Link to={`${this.props.match.url}`}>信息编辑</Link>
							</Menu.Item>
							<Menu.Item key="reserve">
								<Link to={`${this.props.match.url}/reserve`}>预约实验室</Link>
							</Menu.Item>
						</Menu>
					</Sider>
					<Content>
						<Route exact path={`${this.props.match.url}`} component={Info}/>
						<Route path={`${this.props.match.url}/reserve`} component={Reserve}/>
					</Content>
				</Layout>
			</div>
		);
	}
};