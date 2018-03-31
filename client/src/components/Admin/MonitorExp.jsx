import React, { Component } from 'react';
import config from '../../config';
import ColMonitorExp from '../../common/ColMonitorExp';
import { Table, Tabs, Card, message, Popconfirm, Icon } from 'antd';
const TabPane = Tabs.TabPane;

export default class MonitorExp extends Component {
	state = {
		exps: []
	}
	componentWillMount = () => {
		fetch(`${config.server}/api/exps/status`)
		.then(res => {
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
	switchExp = (id, status) => {
		let body = {
			id,
			status
		};
		fetch(`${config.server}/api/admin/exp/switch`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.admin_token
			},
			body: JSON.stringify(body)
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				message.info(json.msg);
				let exps = this.state.exps;
				exps = exps.map(exp => {
					if (exp.id == id)
						exp.door = !exp.door;
					return exp;
				});
				this.setState({
					exps: exps
				});
			}
		});
	};
	render () {
		let columns = [{
			title: '实验室',
			key: '1',
			dataIndex: 'name',
		}, {
			title: '状态',
			key: '2',
			dataIndex: 'people',
			render: text => {
				if (text) {
					return <div><Icon type="team" />{`${text}个人`}</div>
				} else {
					return <div><Icon type="team" />无人</div>
				}
			}
		}]
		// {
		// 	title: '门禁',
		// 	key: '2',
		// 	dataIndex: 'door',
		// 	render: text => {
		// 		if (text) {
		// 			return '打开中'
		// 		} else {
		// 			return '关闭中'
		// 		}
		// 	}
		// }
		// {
		// 	title: '大门控制',
		// 	key: '4',
		// 	dataIndex: 'id',
		// 	render: (id, record) => {
		// 		if (record.door) {
		// 			return (
		// 				<Popconfirm onConfirm={() => this.switchExp(id, 0)} title="确定关闭实验室门？" okText="Yes" cancelText="No">
		// 					<a>关闭</a>
		// 				</Popconfirm>
		// 			);
		// 		} else {
		// 			return (
		// 				<Popconfirm onConfirm={() => this.switchExp(id, 1)} title="确定打开实验室门？" okText="Yes" cancelText="No">
		// 					<a href="#">打开</a>
		// 				</Popconfirm>
		// 			);
		// 		}
		// 	}
		// }
		let tabs = [];
		for (let i = 1; i <= this.state.exps.length; i++) {
			tabs.push(
				<TabPane tab={this.state.exps[i - 1].name} key={i}>
					<ColMonitorExp id={i} />
				</TabPane>
			);
		}
		return (
			<div className="MonitorExp Container">
				<Card>
					<Table rowKey="id" bordered={true} columns={columns} dataSource={this.state.exps} pagination={false}/>
				</Card>
				<Card>
					<Tabs defaultActiveKey="1">
						{tabs}
					</Tabs>
				</Card>
			</div>
		);
	}
}