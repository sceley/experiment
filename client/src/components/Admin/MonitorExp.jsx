import React, { Component } from 'react';
import config from '../../config';
import ColMonitorExp from '../../common/ColMonitorExp';
import { Table, Tabs, Card, message } from 'antd';
const TabPane = Tabs.TabPane;

export default class MonitorExp extends Component {
	state = {
		count: ''
	}
	componentWillMount = () => {
		fetch(`${config.server}/api/expscount`)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (json && !json.err) {
				this.setState({
					count: json.count
				});
			}
		});
	}
	render () {
		let count = this.state.count;
		let tabs = [];
		for (let i = 1; i <= count; i++) {
			tabs.push(
				<TabPane tab={`实验室${i}`} key={i}>
					<ColMonitorExp id={i} />
				</TabPane>
			);
		}
		return (
			<div className="MonitorExp Container">
				<Card>
					<Tabs defaultActiveKey="1">
						{tabs}
					</Tabs>
				</Card>
			</div>
		);
	}
}