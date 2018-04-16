import React, { Component } from 'react';
import config from '../../config';
import { Table, Tabs, Card, message, Icon } from 'antd';
const TabPane = Tabs.TabPane;
class Exp extends Component {
	state = {
		tables: []
	}
	componentDidMount = () => {
		let id = this.props.id;
		fetch(`${config.server}/api/admin/monitorexp/${id}`, {
			method: 'GET',
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
					tables: json.tables
				});
			}
		});
	}
	handleSwitch = (id, e) => {
		let body = {
			id,
			power: e
		};
		fetch(`${config.server}/api/admin/switchpower`, {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'x-access-token': localStorage.admin_token
			},
			body: JSON.stringify(body)
		}).then(res => {
			if (res.ok)
				return res.json();
		}).then(json => {
			if (json && !json.err) {
				let tables = this.state.tables;
				tables = tables.map(table => {
					if (table.id === id) {
						table.power_status = e;
					}
					return table;
				});
				this.setState({
					tables: tables
				});
				message.info(json.msg);
			} else {
				message.error(json.msg);
			}
		});
	}
	render() {
		const columns = [
			{
				title: '座位',
				dataIndex: 'seat',
				key: '1',
				render: text => text
			}, {
				title: '状态',
				dataIndex: 'fault',
				key: '2',
				render: text => {
					if (text) {
						return <div style={{ color: '#f5222d' }}><Icon type="close-square-o" />出故障了，等待维修</div>
					} else {
						return <div style={{ color: '#52c41a' }}><Icon type="check-square" />正常</div>
					}
				}
			}, {
				title: '电源状态',
				dataIndex: 'status',
				key: '3',
				render: text => {
					if (text) {
						return (
							<span>
								<Icon style={{ color: 'green', marginRight: '8px' }} type="poweroff" />
								开启中
                            </span>

						)
					} else {
						return (
							<span>
								<Icon style={{ color: 'red', marginRight: '8px' }} type="poweroff" />
								关闭中
                            </span>

						)
					}
				}
			}
		];
		return (
			<div className="ColMonitor">
				<Table pagination={false} rowKey="id" bordered={true} columns={columns} dataSource={this.state.tables} />
			</div>
		);
	}
};

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
					if (exp.id === id)
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
		}];
		let tabs = [];
		for (let i = 1; i <= this.state.exps.length; i++) {
			tabs.push(
				<TabPane tab={this.state.exps[i - 1].name} key={i}>
					<Exp id={i} />
				</TabPane>
			);
		}
		return (
			<div className="MonitorExp Container">
				<Card
					title="实验室监控"
				>
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
};