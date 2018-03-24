import React, { Component } from 'react';
import config from '../../config';
import ColMonitorExp from '../../common/ColMonitorExp';
import { Table, Tabs, Card } from 'antd';
const TabPane = Tabs.TabPane;

export default class MonitorExp extends Component {
	render () {
		return (
			<div className="MonitorExp Admin-Other-Container">
				<Card>
					<Tabs defaultActiveKey="1">
						<TabPane tab="实验室1" key="1">
							<ColMonitorExp id="1"/>
						</TabPane>
						<TabPane tab="实验室2" key="2">
							<ColMonitorExp id="2"/>
						</TabPane>
						<TabPane tab="实验室3" key="3">
							<ColMonitorExp id="3"/>
						</TabPane>
					</Tabs>
				</Card>
			</div>
		);
	}
}