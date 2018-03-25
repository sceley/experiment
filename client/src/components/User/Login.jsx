import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Input, Icon, message, Button, Form } from 'antd';
import HeaderForLog from '../../common/Header-Log';
import config from '../../config';
import './Login.css';
const FormItem = Form.Item;

class Login extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/user/login`, {
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
						localStorage.user_token = json.token;
						message.info(json.msg);
						this.props.history.push('/user');
					} else if(json) {
						message.error(json.msg);
					}
				});
			}
		});
	}
	checkAccount = (rule, value, cb) => {
		if (value && (value.length == 11 || value.length == 8)) {
			cb();
		} else {
			cb("账号格式不正确");
		}
	}
	checkPassword = (rule, value, cb) => {
		if (value && (value.length >= 6 && value.length <= 16)) {
			cb();
		} else {
			cb("密码格式不正确");
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Login-Wrap">
				<div className="Login">
					<HeaderForLog/>
					<div className="Title">
						账号登录
					</div>
					<Form onSubmit={this.handleSubmit}>
						<FormItem
							label="帐号"
						>
							{getFieldDecorator('Account', {
								rules: [{ required: true, message: '账号不能为空!' 
								}, {
									validator: this.checkAccount
								}],
							})(
								<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号/学号" />
								)}
						</FormItem>
						<FormItem
							label="密码"
						>
							{getFieldDecorator('Password', {
								rules: [{ required: true, message: '密码不能为空!' 
								}, {
									validator: this.checkPassword
								}],
							})(
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符（字母、数字、符号的组合）" />
								)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit" className="login-form-button">
								Log in
							</Button>
							<Link to="/user/logup">现在注册!</Link>
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}
};
export default Form.create()(Login);