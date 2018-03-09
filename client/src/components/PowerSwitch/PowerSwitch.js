import React, { Component } from 'react';
import { List } from 'antd';
import PowerSwitchItem from './PowerSwitchItem';
import config from '../../config';
export default class PowerSwitch extends Component {
	handleSwitch = (id, _switch) => {
		fetch(`${config.server}/devices/${id}/?switch=${_switch}`)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
		}).then(json => {
			if (!json.err) {
				console.log(json);
			}
		});
	}
	render () {
		let data = [{
			name: '机器',
			id: 1
		}];
		return (
			<div className="PowerSwitch">
				<List
					bordered
					dataSource={data}
					renderItem={item => (
						<PowerSwitchItem item={item} handleSwitch={this.handleSwitch} />
					)}
				/>
			</div>
		);
	}
};