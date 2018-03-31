import React, { Component } from 'react';
import { Tabs, Card } from 'antd';
import ColMonitorReserve from '../../common/ColMonitorReserve';
const { TabPane } = Tabs;
export default class ManageReserve extends Component {
	render () {
		return (
			<div className="ManageReserve Container">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="待审核" key="1">
							<ColMonitorReserve status={0}/>
						</TabPane>
						<TabPane tab="已审核" key="2">
							<ColMonitorReserve status={1}/>
						</TabPane>
						<TabPane tab="历史预约" key="3">
							<ColMonitorReserve status={3}/>
						</TabPane>
					</Tabs>
				</Card>
			</div>
		);
	}
};