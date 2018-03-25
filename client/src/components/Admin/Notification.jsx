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
			} else {
				message.error(json.msg);
			}
		});
	}
	componentWillMount = () => {
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
					<Notify handleCancel={this.handleCancel}/>
				</Modal>
			</div>
		);
	}
}