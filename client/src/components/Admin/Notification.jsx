import React, { Component } from 'react';
import { Form, Input, List, Card, Button, Modal, Icon, message, Popconfirm } from 'antd';
import config from '../../config';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
class NotifyForm extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/admin/notify`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.admin_token
					},
					body: JSON.stringify(values)
				}).then(res => {
					if (res.ok)
						return res.json();
				}).then(json => {
					if (json && !json.err) {
						message.info(json.msg);
						this.props.handleCancel();
						this.props.addNotification({
							title: values.Title,
							msg: values.Notification
						});
					} else {
						message.error(json.msg);
					}
				});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Notify">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="标题"
					>
						{getFieldDecorator('Title', {
							rules: [{
								required: true, message: '请输入你的消息标题!',
							}],
						})(
							<Input placeholder="标题" />
						)}
					</FormItem>
					<FormItem
						label="消息"
					>
						{getFieldDecorator('Notification', {
							rules: [{
								required: true, message: '请输入你要发布的消息!',
							}],
						})(
							<TextArea placeholder="消息主体" rows={8} />
						)}
					</FormItem>
					<FormItem>
						<div style={{ textAlign: 'center'}}>
							<Button type="primary" htmlType="submit">发布</Button>
						</div>
					</FormItem>
				</Form>
			</div>
		);
	}
};
const Notify = Form.create()(NotifyForm);
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
				<Button type="primary" onClick={this.showModal} className="add-btn"><Icon type="plus-circle-o" /></Button>
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