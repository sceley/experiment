import React, { Component } from 'react';
import { Form, Button, Input, Icon, message, DatePicker, Cascader, Card, TimePicker } from 'antd';
import config from '../../config';
import moment from 'moment';
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
				fetch(`${config.server}/api/user/addreserve`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.user_token
					},
					body: JSON.stringify({
						exp: values.location[0],
						tab: values.location[1],
						date: values.date.format("YYYY-MM-DD"),
						start: values.start.format("HH:mm"),
						end: values.end.format("HH:mm"),
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
	disabledDate = (date) => {
		let days = moment(date).diff(moment(), 'days');
		if (days >= 0 && days < 7) {
			return false;
		} else {
			return true;
		}
	}
	handleRequset = () => {
		let date = this.props.form.getFieldValue('date').format("YYYY-MM-DD");
		let start = this.props.form.getFieldValue('start').format("HH:mm");
		let end = this.props.form.getFieldValue('end').format("HH:mm");
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
							initialValue: moment(new Date(), "YYYY-MM-DD")
						})(
							<DatePicker format="YYYY-MM-DD" onChange={this.handleRequset} disabledDate={this.disabledDate} placeholder="选择日期" />
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
									initialValue: moment(new Date(), 'HH:mm')
								})(
									<TimePicker format="HH:mm" placeholder="开始时间" onChange={this.handleRequset} />
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
									initialValue: moment(new Date(), 'HH:mm')
								})(
									<TimePicker format="HH:mm" placeholder="结束时间" onChange={this.handleRequset} />
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