import React, { Component } from 'react';
import { Table, Button, Modal, Card, Input, Icon, Popconfirm, Divider } from 'antd';
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
		let exps = this.state.exps;
		exps[id - 1].editable = true
		this.setState({
			exps: exps
		});
	}
	handleCancelEdit = (id) => {
		let exps = this.state.exps;
		exps[id - 1].editable = null;
		this.setState({
			exps: exps
		});
	}
	handleSavaEdit = (id) => {
		let exps = this.state.exps;
		exps[id - 1].editable = null;
		this.setState({
			exps: exps
		});
	}
	showModal = () => {
		this.setState({
			visible: true
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
			}
		});
	}
	render () {
		const EditableCell = (value, record) => (
			<div>
				{	record.editable? 
					<Input style={{ margin: '-5px 0' }} value={value}/>
					:
					value
				}
			</div>
		);

		let columns = [{
			title: '实验室',
			key: '1',
			dataIndex: 'name',
			render: (text, record) => EditableCell(text, record)
		}, {
			title: '实验室ip',
			key: '2',
			dataIndex: 'ip',
			render: (text, record) => EditableCell(text, record)
		}, {
			title: '实验室台数',
			key: '3',
			dataIndex: 'tablesCount',
			render: (text, record) => EditableCell(text, record)
		}, {
			title: '地点',
			key: '4',
			dataIndex: 'address',
			render: (text, record) => EditableCell(text, record)
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
							<Popconfirm title="确定取消?" onConfirm={() => this.handleCancelEdit(record.id)}>
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
						<AddExp handleCancel={this.handleCancel}/>
					</Modal>
				</Card>
			</div>
		);
	}
}