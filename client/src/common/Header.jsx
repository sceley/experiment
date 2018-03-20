import React, { Component } from 'react';
import { Layout, Icon, Button, Modal } from 'antd';
// import Result from './Result';
import './Header.css';
const { Header } = Layout;

export default class Header_c extends Component {
	state = {
		visible: false
	}
	handleLogout = () => {
		this.setState({
			visible: true
		});
	}
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	render () {
		return (
			<Header style={{padding: 0}}>
				<div className="header-container">
					<a onClick={this.handleLogout} className="logout-wrap">
						<Icon type="logout" />
						<span>退出登陆</span>
					</a>
				</div>
				<Modal
					visible={this.state.visible}
					width={450}
					closable={false}
					footer={null}
					bodyStyle={{
						textAlign: 'center'
					}}
				>
					<div className="media-header">
						<Icon className="result" type="info-circle" />
					</div>
					<div className="media-body">
						确定要退出?
					</div>
					<div className="media-footer">
						<Button onClick={this.props.handleLogout} type="primary">确定</Button>
						<Button onClick={this.handleCancel} type="default">取消</Button>
					</div>
				</Modal>
			</Header>
		);
	}
}