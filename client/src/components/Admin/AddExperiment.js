import React, { Component } from 'react';
import { Form, Button, Input, Icon, message } from 'antd';
import config from '../../config';
const FormItem = Form.Item;

class AddExperiment extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/addexperiment`, {
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
						localStorage.token = json.token;
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
			<div className="AddExperiment">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="名称"
					>
						{getFieldDecorator('Name', {
							rules: [{ required: true, message: '名称不能为空!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="输入格式为EXP开头加数字，如EXP1" />
							)}
					</FormItem>
					<FormItem
						label="实验室IP"
					>
						{getFieldDecorator('IP', {
							rules: [{ required: true, message: 'IP不能为空!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="实验室IP" />
							)}
					</FormItem>
					<FormItem
						label="实验台数"
					>
						{getFieldDecorator('TableCount', {
							rules: [{ required: true, message: '数量不能为空!' }],
						})(
							<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="数字" />
							)}
					</FormItem>
					<FormItem
						label="实验室地址"
					>
						{getFieldDecorator('Address', {
							rules: [{ required: true, message: '实验室地址不能为空!' }],
						})(
							<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="实验室地址" />
							)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit">
							添加
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
};
export default Form.create()(AddExperiment);