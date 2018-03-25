import React, { Component } from 'react';
import { Table, Button, Modal, Card, Input, Icon, Popconfirm, Divider, message } from 'antd';
import AddExp from './AddExp';
import config from '../../config';
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
			title: '实验室ip',
			key: '2',
			dataIndex: 'ip',
			render: (text, record) => EditableCell(text, record, "ip")
		}, {
			title: '实验室台数',
			key: '3',
			dataIndex: 'tablesCount',
			render: (text, record) => EditableCell(text, record, "tablesCount")
		}, {
			title: '地点',
			key: '4',
			dataIndex: 'address',
			render: (text, record) => EditableCell(text, record, "address")
		}, {
			title: '操作',
			key: '5',
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
					<Table pagination={false} bordered={true} rowKey="ip" boredered={true} columns={columns} dataSource={this.state.exps}/>
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
}