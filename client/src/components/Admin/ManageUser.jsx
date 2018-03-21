import React, { Component } from 'react';
import { Table } from 'antd';

export default class ManageUser extends Component {
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
			<div className="ManageUser Admin-Other-Container">
				<Table columns={columns}/>
			</div>
		);
	}
}