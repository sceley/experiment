import React, { Component } from 'react';
import { Form, Button, Input, Icon, message } from 'antd';
import HeaderForLog from '../../common/Header-Log';
import Notifications from '../../common/Notifications';
import config from '../../config';
import './Logup.css';
const FormItem = Form.Item;

class Logup extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/logup`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify(values)
				}).then(res => {
					if (res.ok) {
						return res.json();
					}
				}).then(json => {
					if (json && !json.err) {
						message.info(json.msg);
						this.props.history.push('/user/login');
					} else if (json) {
						message.error(json.msg);
					}
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Logup-Wrap">
				<div className="Logup">
					<HeaderForLog/>
					<div className="Title">
						账号注册
					</div>
					<Form onSubmit={this.handleSubmit}>
						<FormItem
							label="学号"
						>
							{getFieldDecorator('Account', {
								rules: [{ required: true, message: '学号不能为空!' }],
							})(
								<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="8位数字的学号" />
								)}
						</FormItem>
						<FormItem
							label="手机号"
						>
							{getFieldDecorator('Mobile', {
								rules: [{ required: true, message: '手机号不能为空!' }],
							})(
								<Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="11位数字的手机号" />
								)}
						</FormItem>
						<FormItem
							label="密码"
						>
							{getFieldDecorator('Password', {
								rules: [{ required: true, message: '密码不能为空!' }],
							})(
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符（字母、数字、符号的组合）" />
								)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit" className="logup-form-button">
								Log up
							</Button>
						</FormItem>
					</Form>
				</div>
				<Notifications/>
			</div>
		);
	}
};
export default Form.create()(Logup);