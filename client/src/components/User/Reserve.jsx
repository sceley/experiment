import React, { Component } from 'react';
import { Form, Button, Input, Icon, Select, message, DatePicker, Cascader, Card } from 'antd';
import config from '../../config';
import moment from 'moment';
const { Option } = Select;
const FormItem = Form.Item;

class Reserve extends Component {
	state = {
		exps: [],
		reserves: [],
		fault_tabs: []
	}
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				let min_start = values['min-start'];
				let min_end = values['min-end'];
				values.start += min_start / 60;
				values.end += min_end / 60;
				fetch(`${config.server}/api/user/addreserve`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.user_token
					},
					body: JSON.stringify({
						exp: values.location[0],
						tab: values.location[1],
						date: moment(values.date).format("YYYY-MM-DD"),
						start: values.start,
						end: values.end,
						equipment: values.equipment
					})
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
	checkHour = (label, value) => {
		const form = this.props.form;
		let start = form.getFieldValue('start');
		let end = form.getFieldValue('end');
		let min_start = form.getFieldValue('min-start');
		let min_end = form.getFieldValue('min-end');
		switch (label) {
			case 'start':
				start = value;
				break;
			case 'end':
				end = value;
				break;
			case 'min-start':
				min_start = value;
				break;
			case 'min-end':
				min_end = value;
				break;
			default:
				console.log('default');
				break;
		};
		start += min_start / 60;
		end += min_end / 60;
		if (start < end) {
			this.handleRequset();
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
		let date = moment(this.props.form.getFieldValue('date')).format("YYYY-MM-DD");
		let start = this.props.form.getFieldValue('start');
		let end = this.props.form.getFieldValue('end');
		let min_start = this.props.form.getFieldValue('min-start');
		let min_end = this.props.form.getFieldValue('min-end');
		start += min_start / 60;
		end += min_end / 60;
		let body = {
			date,
			start,
			end,
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
					exps: json.exps
				});
			}
		});
	}
	componentDidMount = () => {
		this.handleRequset();
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const hourOption = [];
		for (let i = 0; i <= 24; i++) {
			hourOption.push(<Option key={i} value={i}>{i}</Option>);
		}
		const minutesOption = [];
		for (let i = 0; i <= 60; i++) {
			if (i < 10) {
				i = `0${i}`;
			}
			minutesOption.push(<Option key={i} value={i}>{i}</Option>);
		}
		return (
			<div className="Reserve Container">
				<Card
					title="在线预约"
				>
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="日期"
					>
						{getFieldDecorator('date', {
							rules: [{ required: true, message: '请选择日期!' }],
						})(
							<DatePicker onChange={this.handleRequset} disabledDate={this.disabledDate} placeholder="选择日期" />
						)}
					</FormItem>
					<div className="time-label">时间段选择</div>
					<div className="time-select">
						<div className="start-time-select">
							<FormItem
								className="select-item"
							>
								{getFieldDecorator('start', {
									rules: [{ required: true, message: '请输入起始时间!' }],
									initialValue: new Date().getHours()
								})(
									<Select onChange={(e) => this.checkHour('start', e)}>
										{hourOption}
									</Select>
								)}
							</FormItem>
							<div className="item-divide">
								:
							</div>
							<FormItem
								className="select-item"
							>
								{getFieldDecorator('min-start', {
									rules: [{ required: true, message: '请输入起始时间!' }],
									initialValue: '00'
								})(
									<Select onChange={e => this.checkHour('min-start', e)}>
										{minutesOption}
									</Select>
								)}
							</FormItem>
						</div>
						<div className="start-end-divide">
							~
						</div>
						<div className="end-time-select">
							<FormItem
								className="select-item"
							>
								{getFieldDecorator('end', {
									rules: [{ required: true, message: '请输入结束时间!' }],
									initialValue: new Date().getHours() + 1
								})(
									<Select onChange={(e) => this.checkHour('end', e)}>
										{hourOption}
									</Select>
								)}
							</FormItem>
							<div className="item-divide">
								:
							</div>
							<FormItem
								className="select-item"
							>
								{getFieldDecorator('min-end', {
									rules: [{ required: true, message: '请输入起始时间!' }],
									initialValue: '00'
								})(
									<Select onChange={e => this.checkHour('min-end', e)}>
										{minutesOption}
									</Select>
								)}
							</FormItem>
						</div>
					</div>
					<FormItem
						label="位置选择"
					>
						{getFieldDecorator('location', {
							rules: [{ type: 'array', required: true, message: '请选择位置!' }],
						})(
							<Cascader options={this.state.exps} placeholder="选择位置" />
						)}
					</FormItem>
					<FormItem
						label="贵重仪器(可选)"
					>
						{getFieldDecorator('equipment', {
							rules: [{ required: false }],
						})(
							<Input prefix={<Icon type="tool" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="贵重仪器" />
						)}
					</FormItem>
					<FormItem>
						<div style={{textAlign: 'center'}}>
							<Button type="primary" htmlType="submit">
								申请
							</Button>
						</div>
					</FormItem>
				</Form>
				</Card>
			</div>
		);
	}
};
export default Form.create()(Reserve);