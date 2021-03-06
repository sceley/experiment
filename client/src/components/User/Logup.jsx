import React, { Component } from 'react';
import { Link} from 'react-router-dom';
import { Form, Button, Input, Icon, message } from 'antd';
import logo from '../../logo.png';
import config from '../../config';
const FormItem = Form.Item;

class Logup extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/user/logup`, {
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
	checkAccount = (rule, value, cb) => {
		if (value && value.length === 8) {
			cb();
		} else {
			cb("请输入8位数字的学号");
		}
	}
	checkMobile = (rule, value, cb) => {
		if (value && value.length === 11) {
			cb();
		} else {
			cb("请输入11位数字的手机号码");
		}
	}
	checkPassword = (rule, value, cb) => {
		if (value && (value.length >= 6 && value.length <= 16)) {
			cb();
		} else {
			cb("请输入格式正确的密码");
		}
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div style={{ height: '100vh' }} className="Log-Container">
				<div className="Logup">
					<div className="log-logo-wrap">
						<img className="log-logo" src={logo} alt="logo"/>
					</div>
					<div className="Title">
						账号注册
					</div>
					<Form onSubmit={this.handleSubmit}>
						<FormItem
							label="学号"
						>
							{getFieldDecorator('account', {
								rules: [{
									required: true, message: '学号不能为空!'
								}, {
									validator: this.checkAccount
								}],
							})(
								<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="8位数字的学号" />
							)}
						</FormItem>
						<FormItem
							label="手机号"
						>
							{getFieldDecorator('mobile', {
								rules: [{
									required: true, message: '手机号不能为空!'
								}, {
									validator: this.checkMobile
								}],
							})(
								<Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="11位数字的手机号" />
							)}
						</FormItem>
						<FormItem
							label="密码"
						>
							{getFieldDecorator('password', {
								rules: [{
									required: true, message: '密码不能为空!'
								}, {
									validator: this.checkPassword
								}],
							})(
								<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符（字母、数字、符号的组合）" />
							)}
						</FormItem>
						<FormItem>
							<Link className="form-right" to="/user/login">登陆</Link>
							<Button type="primary" htmlType="submit" className="log-form-button">
								注册
						</Button>
						</FormItem>
					</Form>
				</div>
			</div>
		);
	}
};
export default Form.create()(Logup);