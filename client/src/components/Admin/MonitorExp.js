import React, { Component } from 'react';
import config from '../../config';
import { Table } from 'antd';

export default class MonitorExp extends Component {
	componentWillMount = () => {
		fetch(`${config.server}/api/admin/monitorexp`, {
			method: 'Get',
			headers: {
				'x-access-token': localStorage.admin_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				console.log(json);
			}
		});
	}
	render () {
		const columns = [
			{
				title: 'Name',
				dataIndex: 'name',
				key: 'name',
				render: text => <a href="#">{text}</a>,
			}, {
				title: 'Age',
				dataIndex: 'age',
				key: 'age',
			}, {
				title: 'Address',
				dataIndex: 'address',
				key: 'address',
			}, {
				title: 'Action',
				key: 'action',
				render: (text, record) => (
					<span>
					</span>
				)
			}
		];
		return (
			<div className="MonitorExp">
				<Table columns={columns}/>
			</div>
		);
	}
}