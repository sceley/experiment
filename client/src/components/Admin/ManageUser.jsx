import React, { Component } from 'react';
import { Table } from 'antd';
import config from '../../config';
export default class ManageUser extends Component {
	state = {
		users: []
	}
	componentDidMount = () => {
		fetch(`${config.server}/api/users`)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					users: json.users
				});
			}
		});
	}
	render () {
		const columns = [
			{
				title: '学号',
				dataIndex: 'account',
				key: '1',
				render: text => text,
			}, {
				title: '姓名',
				dataIndex: 'name',
				key: '2',
				render: text => text,
			}, {
				title: '性别',
				dataIndex: 'sex',
				key: '3',
				render: text => text,
			}, {
				title: '专业',
				dataIndex: 'major',
				key: '4',
				render: text => text,
			}, {
				title: '手机号码',
				dataIndex: 'mobile',
				key: '5',
				render: text => text,
			}, {
				title: '操作',
				key: '6',
				render: () => {
					return "操作"
				}
			}
		];
		return (
			<div className="ManageUser Admin-Other-Container">
				<Table columns={columns} bordered={true} dataSource={this.state.users}/>
			</div>
		);
	}
}