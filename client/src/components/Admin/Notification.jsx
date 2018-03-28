import React, { Component } from 'react';
import { List, Card, Button, Modal, Icon, message, Popconfirm } from 'antd';
import Notify from '../../common/Notify';
import config from '../../config';
export default class Notification extends Component {
	state = {
		notifications: [],
		visible: false
	}
	showModal = () => {
		this.setState({
			visible: true
		});
	}
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	addNotification = (body) => {
		let notifications = this.state.notifications;
		notifications.push(body);
		this.setState({
			notifications: notifications
		});
	}
	handleDelete = (id) => {
		fetch(`${config.server}/api/admin/notification/${id}`, {
			method: 'delete',
			headers: {
				'x-access-token': localStorage.admin_token
			}
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				message.info(json.msg);
				let notifications = this.state.notifications;
				notifications = notifications.filter(notification => {
					return notification.id !== id;
				});
				this.setState({
					notifications: notifications
				});
			} else {
				message.error(json.msg);
			}
		});
	}
	componentWillMount = () => {
		this.mounted = true;
		fetch(`${config.server}/api/notifications`)
		.then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					notifications: json.notifications
				});
			}
		});
	}
	render () {
		return (
			<div className="Notification Container">
				<Button onClick={this.showModal} className="add-btn">Add</Button>
				<List
					grid={{ gutter: 16, column: 3 }}
					dataSource={this.state.notifications}
					renderItem={item => (
						<List.Item>
							<Card
								title={item.title}
								actions={[
									<Popconfirm title="确定取消?" onConfirm={() => this.handleDelete(item.id)} okText="Yes" cancelText="No">
										<Icon type="delete"/>
									</Popconfirm>
								]}
							>{item.msg}</Card>
						</List.Item>
					)}
				/>
				<Modal
					visible={this.state.visible}
					footer={null}
					closable={false}
					onCancel={this.handleCancel}
				>
					<Notify addNotification={this.addNotification} handleCancel={this.handleCancel}/>
				</Modal>
			</div>
		);
	}
}