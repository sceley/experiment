import React, { Component } from 'react';
import { Table, Switch, message} from 'antd';
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
				console.log(json.users);
				this.setState({
					users: json.users
				});
			}
		});
	}
	handleSwitch = (id, e) => {
		let body = {
			id,
			forbidden: e
		};
		fetch(`${config.server}/api/admin/monitoruser`, {
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
				message.info(json.msg);
			} else {
				message.error(json.msg);
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
				title: '年级',
				dataIndex: 'grade',
				key: '5',
				render: text => text,
			}, {
				title: '手机号码',
				dataIndex: 'mobile',
				key: '6',
				render: text => text,
			}, {
				title: '激活状态',
				dataIndex: 'active',
				key: '7',
				render: text => {
					if (text)
						return '是';
					else
						return '否';
				}
			}, {
				title: '操作',
				dataIndex: 'id',
				key: '7',
				render: id => {
					let forbidden = this.state.users[id] && this.state.users[id].forbidden;
					let handleChange = e => {
						this.handleSwitch(id, e);
					}
					return (
						<Switch onChange={handleChange} checkedChildren="禁止" unCheckedChildren="允许" defaultChecked={forbidden} />
					)
				}
			}
		];
		return (
			<div className="ManageUser Admin-Other-Container">
				<Table rowKey="id" columns={columns} bordered={true} dataSource={this.state.users}/>
			</div>
		);
	}
}