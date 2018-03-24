import React, { Component } from 'react';
import { Form, Button, Input, Icon, Radio, Select, message, Card } from 'antd';
import config from '../../config';
const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Info extends Component {
	state = {
		user: ''
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/userinfo/edit`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.user_token
					},
					body: JSON.stringify(values),
				}).then(res => {
					if (res.ok) {
						return res.json();
					}
				}).then(json => {
					if (json && !json.err) {
						message.info(json.msg);
					} else if(json) {
						message.error(json.msg);
					}
				});
			}
		});
	}
	componentWillMount = () => {
		fetch(`${config.server}/api/userinfo`, {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					user: json.user
				});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Info Container">
				<Card>
					<Form onSubmit={this.handleSubmit}>
						<FormItem
							label="姓名"
						>
							{getFieldDecorator('Name', {
								rules: [{ required: true, message: '姓名不能为空!' }],
								initialValue: this.state.user && this.state.user.name
							})(
								<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="姓名" />
								)}
						</FormItem>
						<FormItem
							label="学号"
						>
							{getFieldDecorator('SchoolNumber', {
								rules: [{ required: true, message: '学号不能为空!' }],
								initialValue: this.state.user && this.state.user.account
							})(
								<Input disabled={true} prefix={<Icon type="code" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="8位数字的学号" />
								)}
						</FormItem>
						<FormItem
							label="性别"
						>
							{getFieldDecorator('Sex', {
								rules: [{ required: true}],
								initialValue: this.state.user && this.state.user.sex,
							})(
								<RadioGroup>
									<Radio value="man">男</Radio>
									<Radio value="girl">女</Radio>
								</RadioGroup>
								)}
						</FormItem>
						<FormItem
							label="手机号"
						>
							{getFieldDecorator('Mobile', {
								rules: [{ required: true, message: '手机号不能为空!' }],
								initialValue: this.state.user && this.state.user.mobile
							})(
								<Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="11位数字的手机号" />
								)}
						</FormItem>
						<FormItem
							label="专业"
						>
							{getFieldDecorator('Major', {
								rules: [{ required: true, message: '专业不能为空!' }],
								initialValue: this.state.user && this.state.user.major
							})(
								<Input prefix={<Icon type="flag" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="专业" />
								)}
						</FormItem>
						<FormItem
							label="年级"
						>
							{getFieldDecorator('Grade', {
								rules: [{ required: true}],
								initialValue: this.state.user && this.state.user.grade,
							})(
								<Select>
									<Option value="1">大一</Option>
									<Option value="2">大二</Option>
									<Option value="3">大三</Option>
									<Option value="4">大四</Option>
								</Select>
								)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit">
								修改
							</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
		);
	}
};
export default Form.create()(Info);