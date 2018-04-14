import React, { Component } from 'react';
import { Table, Button, Modal, Card,Form, Input, Icon, Popconfirm, Divider, message } from 'antd';
import config from '../../config';
const FormItem = Form.Item;
class AddExpForm extends Component {
	handleSubmit = (e) => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				fetch(`${config.server}/api/admin/addexp`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						'x-access-token': localStorage.admin_token
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
						this.props.handleCancel();
						this.props.addExp({
							name: values.Name,
							ip: values.IP,
							port: values.Port,
							tablesCount: values.TablesCount,
							address: values.Address
						});
					} else if (json) {
						message.error(json.msg);
					}
				});
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="AddExp">
				<Form onSubmit={this.handleSubmit}>
					<FormItem
						label="名称"
					>
						{getFieldDecorator('Name', {
							rules: [{ required: true, message: '名称不能为空!' }],
						})(
							<Input placeholder="实验室名称" />
						)}
					</FormItem>
					<FormItem
						label="实验室IP"
					>
						{getFieldDecorator('IP', {
							rules: [{ required: true, message: 'IP不能为空!' }],
						})(
							<Input placeholder="实验室IP" />
						)}
					</FormItem>
					<FormItem
						label="实验室IP端口"
					>
						{getFieldDecorator('Port', {
							rules: [{ required: true, message: '实验室IP端口不能为空!' }],
						})(
							<Input placeholder="实验室IP端口" />
						)}
					</FormItem>
					<FormItem
						label="实验台数"
					>
						{getFieldDecorator('TablesCount', {
							rules: [{ required: true, message: '数量不能为空!' }],
						})(
							<Input placeholder="数字" />
						)}
					</FormItem>
					<FormItem
						label="实验室地址"
					>
						{getFieldDecorator('Address', {
							rules: [{ required: true, message: '实验室地址不能为空!' }],
						})(
							<Input placeholder="实验室地址" />
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
const AddExp = Form.create()(AddExpForm);
export default class Exps extends Component {
	state = {
		visible: false,
		exps: []
	}
	handleCancel = () => {
		this.setState({
			visible: false
		});
	}
	handleEdit = (id) => {
		const newExps = [...this.state.exps];
		const target = newExps.filter(item => id === item.id)[0];
		if (target) {
			target.editable = true;
			this.setState({
				exps: newExps
			});
		}
	}
	handleCancelEdit = (id) => {
		const newExps = [...this.state.exps];
		const target = newExps.filter(item => id === item.id)[0];
		if (target) {
			Object.assign(target, this.cacheExps.filter(item => id === item.id)[0]);
			delete target.editable;
			this.setState({
				exps: newExps
			});
		}
	}
	handleChange = (id, key, value) => {
		const newExps = [...this.state.exps];
		const target = newExps.filter(item => id === item.id)[0];
		if (target) {
			target[key] = value;
			this.setState({ exps: newExps });
		}
	}
	handleSavaEdit = (id) => {
		const newExps = [...this.state.exps];
		const target = newExps.filter(item => id === item.id)[0];
		if (!target)
			return;
		delete target.editable;
		fetch(`${config.server}/api/admin/exp/edit`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.admin_token
			},
			body: JSON.stringify(target)
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				message.info(json.msg);
				this.setState({
					exps: newExps
				});
				this.cacheData = newExps.map(item => ({ ...item }));
			}
		});
	}
	showModal = () => {
		this.setState({
			visible: true
		});
	}
	addExp = (option) => {
		let exps = this.state.exps;
		exps.push(option);
		this.setState({
			exps: exps
		});
	}
	componentWillMount = () => {
		this.mounted = true;
		fetch(`${config.server}/api/admin/exps`, {
			method: 'get',
			headers: {
				'x-access-token': localStorage.admin_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					exps: json.exps
				});
				this.cacheExps = json.exps;
			}
		});
	}
	render () {
		const EditableCell = (value, record, name) => (
			<div>
				{	record.editable? 
					<Input onChange={(e) => this.handleChange(record.id, name, e.target.value)} style={{ margin: '-5px 0' }} defaultValue={value}/>
					:
					value
				}
			</div>
		);
		let columns = [{
			title: '实验室',
			key: '1',
			dataIndex: 'name',
			render: (text, record) => EditableCell(text, record, "name")
		}, {
			title: '实验室IP',
			key: '2',
			dataIndex: 'ip',
			render: (text, record) => EditableCell(text, record, "ip")
		}, {
			title: '实验室IP端口',
			key: '3',
			dataIndex: 'port',
			render: (text, record) => EditableCell(text, record, "port")
		}, {
			title: '实验室台数',
			key: '4',
			dataIndex: 'tablesCount',
			render: (text, record) => EditableCell(text, record, "tablesCount")
		}, {
			title: '地点',
			key: '5',
			dataIndex: 'address',
			render: (text, record) => EditableCell(text, record, "address")
		}, {
			title: '操作',
			key: '6',
			dataIndex: 'id',
			render: (text, record) => {
				if (record.editable) {
					return (
						<span>
							<a onClick={() => this.handleSavaEdit(record.id)}>Save</a>
							<Divider type="vertical" />
							<Popconfirm title="确定取消?" onConfirm={() => this.handleCancelEdit(record.id)} okText="Yes" cancelText="No">
								<a>Cancel</a>
							</Popconfirm>
						</span>
					);
				} else {
					return (
						<a>
							<Icon onClick={() => this.handleEdit(record.id)} type="form" />
						</a>
					);
				}
			}
		}]
		return (
			<div className="Exps Container">
				<Card>
					<Button onClick={this.showModal} className="add-btn">Add</Button>
					<Table pagination={false} bordered={true} rowKey="id" boredered={true} columns={columns} dataSource={this.state.exps}/>
					<Modal
						visible={this.state.visible}
						closable={false}
						onCancel={this.handleCancel}
						footer={null}
					>
						<AddExp addExp={this.addExp} handleCancel={this.handleCancel}/>
					</Modal>
				</Card>
			</div>
		);
	}
};