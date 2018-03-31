import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Icon, message, Button, Form } from 'antd';
import HeaderForLog from '../../common/Header-Log';
import config from '../../config';
const FormItem = Form.Item;

class Login extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/admin/login`, {
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
						localStorage.admin_token = json.token;
						this.props.history.push('/admin');
						message.info(json.msg);
					} else if(json) {
						message.error(json.msg);
					}
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Login-Wrap">
			<div className="Login">
				<HeaderForLog/>
				<div className="Title">
					管理员登录
				</div>
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="帐号"
					>
						{getFieldDecorator('Account', {
							rules: [{ required: true, message: '账号不能为空!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="账号" />
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
						<Link className="form-right" to="/user/login">学生登陆</Link>
						<Button type="primary" htmlType="submit" className="login-form-button">
							Log in
						</Button>
					</FormItem>
				</Form>
			</div>
			</div>
		);
	}
};
export default Form.create()(Login);