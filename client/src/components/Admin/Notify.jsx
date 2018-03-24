import React, { Component } from 'react';
import { Form, Input, Card, Button } from 'antd';
const FormItem = Form.Item;
const TextArea = Input.TextArea;
class Notify extends Component {
	render() {
		const { getFieldDecorator } = this.props.form;
		return (
			<div className="Notify Admin-Other-Container">
				<Card>
					<Form onSubmit={this.handleSubmit}>
						<FormItem
							label="消息"
						>
							{getFieldDecorator('Information', {
								rules: [{
									type: 'email', message: 'The input is not valid E-mail!',
								}, {
									required: true, message: 'Please input your E-mail!',
								}],
							})(
								<TextArea rows={8} />
							)}
						</FormItem>
						<FormItem>
							<Button type="primary" htmlType="submit">发布</Button>
						</FormItem>
					</Form>
				</Card>
			</div>
		);
	}
};
export default Form.create()(Notify);