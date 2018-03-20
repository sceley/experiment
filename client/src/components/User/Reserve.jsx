import React, { Component } from 'react';
import { Form, Button, Input, Icon, Radio, Select, Cascader, message } from 'antd';
import config from '../../config';
const RadioGroup = Radio.Group;
const { Option } = Select;
const FormItem = Form.Item;

class Reserve extends Component {
	state = {
		experiments: ''
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				console.log(values);
				fetch(`${config.server}/api/addreserve`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.user_token
					},
					body: JSON.stringify(values)
				}).then(res => {
					if (res.ok) {
						return res.json();
					}
				}).then(json => {
					if (!json.err) {
						message.info(json.msg);
					}
				});
			}
		});
	}

	componentWillMount = () => {
		fetch(`${config.server}/api/experiments`)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				for (let i = 0; i < json.experiments.length; i++) {
					json.experiments[i].tables = [];
				}
				for (let i = 0; i < json.tables.length; i++) {
					let id = json.tables[i].exp_id;
					json.experiments[id - 1].tables.push(json.tables[i]);
				}
				this.setState({
					experiments: json.experiments
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const residences = [];
		for (let i = 1; i <= this.state.experiments.length; i++) {
			let item = {
				value: `${i}`,
				label: `实验室${i}`,
				disabled: Boolean(this.state.experiments[i - 1].experiment_status),
				children: []
			};
			for (let j = 1; j <= this.state.experiments[i - 1].tables.length; j++) {
				item.children.push({
					value: `${j}`,
					label: `实验桌${j}`,
					disabled: Boolean(this.state.experiments[i - 1].tables[j - 1].status)
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