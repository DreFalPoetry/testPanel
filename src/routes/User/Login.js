import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Checkbox, Alert, Icon, Form, Input, Button } from 'antd';
import Login from 'components/Login';
import styles from './Login.less';
import { realUserLogin } from '../../services/api';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
const FormItem = Form.Item;

@Form.create()
@connect(({ login, loading }) => ({
	login,
	submitting: loading.effects['login/login'],
}))
export default class LoginPage extends Component {
	state = {
		type: 'account',
		autoLogin: true,
	};

	onTabChange = type => {
		this.setState({ type });
	};

	handleSubmit = e => {
		e.preventDefault();
		this.props.form.validateFields((err, values) => {
			if (!err) {
				const response = realUserLogin(values);
				response
					.then(res => {
						return res;
					})
					.then(json => {
						if (json.code !== undefined && json.code !== null) {
							if (json.code == 0) {
								json.currentAuthority = 'admin';
								this.props.dispatch({
									type: 'login/changeLoginStatus',
									payload: json,
								});
								let userinfo = {};
								sessionStorage.setItem('loginUserInfo', JSON.stringify(userinfo));
								this.props.dispatch({
									type: 'login/asyncUserInfo',
									payload: { userinfo },
								});
								reloadAuthorized();
								this.props.history.push('/pannel');
							} else if (json.code == 1) {
								sessionStorage.removeItem('loginUserInfo');
								setAuthority('guest');
								reloadAuthorized();
								this.props.history.push('/user/login');
							} else {
								this.props.form.setFields({
									password: {
										errors: [new Error(json.info)],
									},
								});
								// message.error(json.info);
							}
						}
					});
			}
		});
		// const { type } = this.state;
		// if (!err) {
		// 	this.props.dispatch({
		// 		type: 'login/realLogin',
		// 		payload: {
		// 			...values,
		// 		},
		// 	});
		// }
	};

	changeAutoLogin = e => {
		this.setState({
			autoLogin: e.target.checked,
		});
	};

	renderMessage = content => {
		return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
	};

	render() {
		const { login, submitting } = this.props;
		const { type } = this.state;
		const { getFieldDecorator } = this.props.form;
		return (
			<div className={styles.main}>
				<Form onSubmit={this.handleSubmit} className="login-form">
					<FormItem>
						{getFieldDecorator('email', {
							rules: [{ required: true, message: 'Please input your Email!' }],
						})(
							<Input
								size="large"
								prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
								placeholder="Email"
							/>
						)}
					</FormItem>
					<FormItem>
						{getFieldDecorator('password', {
							rules: [{ required: true, message: 'Please input your Password!' }],
						})(
							<Input
								size="large"
								prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
								type="password"
								placeholder="Password"
							/>
						)}
					</FormItem>
					<FormItem>
						<Button
							size="large"
							type="primary"
							htmlType="submit"
							className="login-form-button"
							style={{ width: '100%' }}
						>
							Log in
						</Button>
					</FormItem>
				</Form>
				{/* <Login
					defaultActiveKey={type}
					onTabChange={this.onTabChange}
					onSubmit={this.handleSubmit}
				>
					<UserName name="email" placeholder="Email" />
					<Password name="password" placeholder="Password" />
					<Submit loading={submitting}>Login</Submit>
				</Login> */}
			</div>
		);
	}
}
