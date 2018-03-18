import React, { Component } from 'react';
import { Form, Button, Input, Icon, Radio, Select, Cascader } from 'antd';
import config from '../../config';
const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Reserve extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values);
				// fetch('http://localhost:8080/login', {
				// 	method: 'POST',
				// 	headers: {
				// 		'Content-Type': 'application/json'
				// 	},
				// 	credentials: 'include',
				// 	body: JSON.stringify(values)
				// }).then(res => {
				// 	if (res.ok) {
				// 		return res.json();
				// 	}
				// }).then(json => {
				// 	if (!json.err) {
				// 	}
				// });
			}
		});
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const formItemLayout = {
		      labelCol: {
		        xs: { span: 24 },
		        sm: { span: 8 },
		      },
		      wrapperCol: {
		        xs: { span: 24 },
		        sm: { span: 16 },
		      },
		};
		const residences = [];
		for (let i = 1; i <= 3; i++) {
			let item = {
				value: `EXP1${i}`,
				label: `实验室${i}`,
				children: []
			};
			for (let j = 1; j <= 10; j++) {
				item.children.push({
					value: `Tab${j}`,
					label: `实验桌${j}`
				});
			}
			residences.push(item);
		}
		return (
			<div className="Reserve">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
					label="位置选择"
					>
					{getFieldDecorator('Location', {
						rules: [{ type: 'array', required: true, message: '请选择位置!' }],
					})(
					<Cascader options={residences} placeholder="选择位置" />
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