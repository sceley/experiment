import React, { Component } from 'react';
import { Table, Icon, Switch, Card } from 'antd';
import moment from 'moment';
import config from '../../config';
export default class ManageReserve extends Component {
	state = {
		reserves: []
	}
	componentWillMount = () => {
		fetch(`${config.server}/api/reserves?status=0`)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					reserves: json.reserves
				});
			}
		});
	}
	permission = (id) => {
		fetch(`${config.server}/api/admin/monitorreserve/${id}`, {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.admin_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			console.log(json);
		});
		
	}
	render () {
		const columns = [{
			title: '序列',
			dataIndex: 'id',
			key: '1',
			render: text => text,
		}, {
			title: '时间',
			dataIndex: 'createAt',
			key: '2',
			render: text => moment(text).format("YYYY-MM-DD")
		}, {
			title: '实验室',
			dataIndex: 'exp_id',
			key: '3',
			render: text => `实验室${text}`
		}, {
			title: '座位',
			dataIndex: 'table_id',
			key: '4',
			render: text => `${text}`
		}, {
			title: '地点',
			dataIndex: 'address',
			key: '5'
		}, {
			title: '其他设备',
			dataIndex: 'equipment',
			key: '6',
			render: text => text || '无'
		}, {
			title: '状态',
			dataIndex: 'status',
			key: '7',
			render: text => {
				if (text === 0)
					return '审核中'
				else
					return '通过'
			}
		}, {
			title: '开始时间',
			dataIndex: 'start',
			render: text => {
				return text;
			}
		}, {
			title: '结束时间',
			dataIndex: 'end',
			render: text => {
				return `${text}`;
			}
		}, {
			title: '操作',
			dataIndex: 'id',
			key: '8',
			render: (id) => {
				let handleChange = () => {
					this.permission(id);
				};
				return (
					<Switch onChange={handleChange} checkedChildren="允许" unCheckedChildren="不允许" defaultChecked={false} />
				);
			}
		}];
		return (
			<div className="ManageReserve Admin-Other-Container">
				<Card>
					<Table rowKey="id" bordered={true} columns={columns} dataSource={this.state.reserves}/>
				</Card>
			</div>
		);
	}
};