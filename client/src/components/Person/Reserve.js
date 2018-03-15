import React, { Component } from 'react';
import { Form, Button, Input, Icon, Radio, Select } from 'antd';
import config from '../../config';
const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Reserve extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch('http://localhost:8080/login', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify(values)
				}).then(res => {
					if (res.ok) {
						return res.json();
					}
				}).then(json => {
					if (!json.err) {
					}
				});
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const ES = [];
		for (let i = 1; i <= 3; i++)
			ES.push(<Radio key={`${i}`} value={`${i}`}>{`${i}号`}</Radio>);
		const TS = [];
		for (let i = 1; i <= 10; i++) {
			TS.push(<Radio key={`${i}`} value={`${i}`}>{`${i}号`}</Radio>);
		}
		return (
			<div className="Reserve">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="实验室"
					>
						{getFieldDecorator('Exp', {
							rules: [{ required: true}],
							initialValue: "1"
						})(
							<RadioGroup>
						        {ES}
							</RadioGroup>
							)}
					</FormItem>
					<FormItem
						label="实验桌"
					>
						{getFieldDecorator('Tab', {
							rules: [{ required: true}],
							initialValue: "1"
						})(
							<RadioGroup>
						        {TS}
							</RadioGroup>
							)}
					</FormItem>
					<FormItem
						label="贵重仪器(可选)"
					>
						{getFieldDecorator('Equipment', {
							rules: [{ required: false}],
						})(
							<Input prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="贵重仪器" />
						)}
					</FormItem>
					<FormItem>
						<Button type="primary" htmlType="submit">
							申请
						</Button>
					</FormItem>
				</Form>
			</div>
		);
	}
};
export default Form.create()(Reserve);