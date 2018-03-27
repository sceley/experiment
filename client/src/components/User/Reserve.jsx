import React, { Component } from 'react';
import { Form, Button, Input, Icon, Select, message, DatePicker, Cascader, Row, Col, Card } from 'antd';
import config from '../../config';
import moment from 'moment';
const { Option } = Select;
const FormItem = Form.Item;

class Reserve extends Component {
	state = {
		exps: [],
		reserves: []
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				values.Exp = values.Location[0];
				values.Tab = values.Location[1];
				values.Date = moment(values.Date).format("YYYY-MM-DD");
				delete values.Location;
				fetch(`${config.server}/api/user/addreserve`, {
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
					} else if (json) {
						message.warning(json.msg);
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
			this.handleRequset();
			cb();
		}
	}
	disabledDate = (date) => {
		let days = moment(date).diff(moment(), 'days');
		if (days >= 0 && days < 7) {
			return false;
		} else {
			return true;
		}
	}
	handleRequset = () => {
		let Date = moment(this.props.form.getFieldValue('Date')).format("YYYY-MM-DD");
		let Start = this.props.form.getFieldValue('Start');
		let End = this.props.form.getFieldValue('End');
		let body = {
			Date,
			Start,
			End,
		};
		fetch(`${config.server}/api/restexps`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body)
		}).then(res => {
			if (res.ok) 
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					exps: json.exps,
					reserves: json.reserves
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const residences = [];
		for (let i = 1; i <= this.state.exps.length; i++) {
			let item = {
				value: `${i}`,
				label: this.state.exps[i - 1].name,
				children: []
			};
			for (let j = 1; j <= this.state.exps[i - 1].tablesCount; j++) {
				item.children.push({
					value: `${j}`,
					label: `实验桌${j}`,
				});
			}
			residences.push(item);
		}
		for (let i = 0; i < this.state.reserves.length; i++) {
			let reserves = this.state.reserves[i];
			residences[reserves.exp_id - 1].children[reserves.table_id - 1].disabled = true;
			residences[reserves.exp_id - 1].children[reserves.table_id - 1].label += '(被占用)';
		}
		let Options = [];
		for (let i = 8; i <= 22; i++) {
			let disabled = false;
			let hour = new Date().getHours();
			if (i < hour)
				disabled = true;
			Options.push(<Option disabled={disabled} key={i} value={i}>{`${i}时`}</Option>);
		}
		return (
			<div className="Reserve Container">
				<Card>
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
					<div className="media">
						<div className="media-header">
							<FormItem
								label="时间段选择"
							>
								{getFieldDecorator('Start', {
									rules: [{ required: true, message: '请输入起始时间!' }],
								})(
									<Select>
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
									<Select>
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
							<Cascader options={residences} placeholder="选择位置" />
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
				</Card>
			</div>
		);
	}
};
export default Form.create()(Reserve);