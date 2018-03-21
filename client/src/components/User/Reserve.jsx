import React, { Component } from 'react';
import { Form, Button, Input, Icon, Select, message, DatePicker, Cascader, Row, Col } from 'antd';
import config from '../../config';
import moment from 'moment';
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
				values.Exp = values.Location[0];
				values.Tab = values.Location[1];
				values.Date = moment(values.Date).format("YYYY-MM-DD");
				delete values.Location;
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
	checkHour = (rule, value, cb) => {
		let Start = this.props.form.getFieldValue('Start');
		let End = this.props.form.getFieldValue('End');
		if (End <= Start) {
			cb("请选择合适的时间段");
		} else {
			cb();
		}
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
	disabledDate = (date) => {
		let days = moment(date).diff(moment(), 'days');
		if (days >= 0 && days < 7) {
			return false;
		} else {
			return true;
		}
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const residences = [];
					// disabled: Boolean(this.state.experiments[i - 1].tables[j - 1].status)
				// disabled: Boolean(this.state.experiments[i - 1].experiment_status),
		for (let i = 1; i <= this.state.experiments.length; i++) {
			let item = {
				value: `${i}`,
				label: `实验室${i}`,
				children: []
			};
			for (let j = 1; j <= this.state.experiments[i - 1].tables.length; j++) {
				item.children.push({
					value: `${j}`,
					label: `实验桌${j}`,
				});
			}
			residences.push(item);
		}
		let Options = [];
		for (let i = 8; i <= 22; i++) {
			Options.push(<Option key={i} value={i}>{`${i}时`}</Option>);
		}
		return (
			<div className="Reserve User-Wrap">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="日期"
					>
						{getFieldDecorator('Date', {
							rules: [{ required: true, message: '请选择日期!' }],
						})(
							<DatePicker disabledDate={this.disabledDate} placeholder="选择日期" />
						)}
					</FormItem>
					<div className="Stime">
						<div>
							<FormItem
								label="时间段选择"
							>
								{getFieldDecorator('Start', {
									rules: [{ required: true, message: '请输入起始时间!' }],
								})(
									<Select style={{ width: '194px' }}>
										{Options}
									</Select>
								)}
							</FormItem>
						</div>
						<div className="media-body">
							~
						</div>
						<div className="media-footer">
							<FormItem
							>
								{getFieldDecorator('End', {
									rules: [{ required: true, message: '请输入起始时间!' }
									, {
										validator: this.checkHour
									}],
								})(
									<Select style={{ width: '194px' }}>
										{Options}
									</Select>
								)}
							</FormItem>
						</div>
					</div>
					<FormItem
						label="位置选择"
					>
						{getFieldDecorator('Location', {
							rules: [{ type: 'array', required: true, message: '请选择位置!' }],
						})(
							<Cascader style={{ width: 'auto' }} options={residences} placeholder="选择位置" />
						)}
					</FormItem>
					<FormItem
						label="贵重仪器(可选)"
					>
						{getFieldDecorator('Equipment', {
							rules: [{ required: false }],
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