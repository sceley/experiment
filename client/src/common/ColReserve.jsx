import React, { Component } from 'react';
import moment from 'moment';
import { Table, message, Icon, Popconfirm } from 'antd';
import config from '../config'
export default class ConReserve extends Component {
	state = {
		reserves: []
	}
	componentWillMount = () => {
		this.mounted = true;
		let complete = this.props.complete;
		fetch(`${config.server}/api/user/onereserves?complete=${complete}`, {
			method: 'GET',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
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
	cancelReserve = (id) => {
		fetch(`${config.server}/api/user/reserve/${id}`, {
			method: 'delete',
			headers: {
				'x-access-token': localStorage.user_token
			}
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				let reserves = this.state.reserves;
				reserves = reserves.filter(reserve => {
					return reserve.id != id;
				});
				this.setState({
					reserves: reserves
				});
				message.info(json.msg);
			} else {
				message.error(json.msg);
			}
		});
	} 
	render () {
		const columns = [{
			title: '序列',
			dataIndex: 'id',
			key: '1',
			render: text => text,
		}, {
			title: '实验室',
			dataIndex: 'name',
			key: '2',
			render: text => text
		}, {
			title: '座位',
			dataIndex: 'seat',
			key: '3',
			render: text => `${text}`
		}, {
			title: '预约时间',
			dataIndex: 'id',
			key: '4',
			render: (id, record) => {
				let date = moment(record.date).format("YYYY-MM-DD");
				let start = record.start;
				let end = record.end;
				return `${date} ${start}-${end}时`
			}
		}, {
			title: '地点',
			dataIndex: 'address',
			key: '5',
			render: text => text
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
			title: '预约单操作',
			dataIndex: 'id',
			key: '8',
			render: (id, record) => {
				let handleCancel = () => {
					this.cancelReserve(id);
				};
				return (
					<Popconfirm title="确定取消?" okText="Yes" cancelText="No" onConfirm={handleCancel}>
						<a>
							取消
  						</a>
					</Popconfirm>
				);
			}
		}];
		return (
			<div>
				<Table pagination={false} rowKey="id" columns={columns} bordered={true} dataSource={this.state.reserves} />
			</div>
		);
	}
}