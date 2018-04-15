import React, { Component } from 'react';
import { Tabs, Card, Popconfirm } from 'antd';
import Reserve from '../../common/Reservation';
const { TabPane } = Tabs;
export default class MonitorReserve extends Component {
	action = {
		title: '操作',
		dataIndex: 'id',
		key: '11',
		render: (id, record) => {
			const status = record.status;
			const handleChange = () => {
				this.action.permission(id, !status);
			};
			if (status) {
				return (
					<Popconfirm title="确定不允许?" onConfirm={handleChange} okText="Yes" cancelText="No">
						<a>不允许</a>
					</Popconfirm>
				);
			} else {
				return (
					<Popconfirm title="确定允许?" onConfirm={handleChange} okText="Yes" cancelText="No">
						<a>允许</a>
					</Popconfirm>
				);
			}
		}
	}
	render () {
		return (
			<div className="ManageReserve Container">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="待审核预约" key="1">
							<Reserve action={this.action} _role="admin" status={0}/>
						</TabPane>
						<TabPane tab="已审核预约" key="2">
							<Reserve action={this.action} _role="admin" status={1}/>
						</TabPane>
						<TabPane tab="执行中预约" key="3">
							<Reserve _role="admin" status={2} />
						</TabPane>
						<TabPane tab="已执行预约" key="4">
							<Reserve _role="admin" status={3}/>
						</TabPane>
					</Tabs>
				</Card>
			</div>
		);
	}
};