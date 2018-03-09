import React, { Component } from 'react';
import { List, Switch } from 'antd';
export default class PowerSwitchItem extends Component {
	handleChange = (e) => {
		this.props.handleSwitch(this.props.item.id, e);
	}
	render () {
		return (
			<List.Item
				actions={[<Switch onChange={this.handleChange} checkedChildren="开" unCheckedChildren="关" />]}
			>
				{this.props.item.name}
			</List.Item>
		);
	}
}