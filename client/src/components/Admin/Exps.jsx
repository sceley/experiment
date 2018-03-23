import React, { Component } from 'react';
import { Table, Button, Modal } from 'antd';
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
		let columns = [{
			title: '实验室',
			key: '1',
			dataIndex: 'name',
			render: text => text,
		}, {
			title: '实验室ip',
			key: '2',
			dataIndex: 'ip',
			render: text => text,
		}, {
			title: '实验室台数',
			key: '3',
			dataIndex: 'tablesCount',
			render: text => text
		}, {
			title: '地点',
			key: '4',
			dataIndex: 'address',
			render: text => text
		}, {
			title: '操作',
			key: '5',
			dataIndex: 'id',
			render: text => text
		}]
		return (
			<div className="Exps Admin-Other-Container">
				<Button onClick={this.showModal} className="add-btn">Add</Button>
				<Table rowKey="ip" boredered={true} columns={columns} dataSource={this.state.exps}/>
				<Modal
					visible={this.state.visible}
					closable={false}
					onCancel={this.handleCancel}
					footer={null}
				>
					<AddExp handleCancel={this.handleCancel}/>
				</Modal>
			</div>
		);
	}
}