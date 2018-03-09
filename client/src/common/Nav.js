import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Icon } from 'antd';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

export default class Nav extends Component {
	handleClick = (e) => {
		// console.log('click ', e);
	}
	render() {
		return (
			<Menu
				onClick={this.handleClick}
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				mode="inline"
				theme="dark"
			>
				
				<Menu.Item key="1">
					<Link to="/manage/powerswitch">
						电源控制
					</Link>
				</Menu.Item>
				<Menu.Item key="10">Option 10</Menu.Item>
				<Menu.Item key="11">Option 11</Menu.Item>
				<Menu.Item key="12">Option 12</Menu.Item>
			</Menu>
		)
	}
};