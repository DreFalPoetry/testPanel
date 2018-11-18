import { setAuthority } from './authority';
import { reloadAuthorized } from './Authorized';
import { notification } from 'antd';
import { routerRedux } from 'dva/router';
import store from '../index';

export function sessionInvalid() {
	const { dispatch } = store;
	sessionStorage.removeItem('loginUserInfo');
	setAuthority('guest');
	reloadAuthorized();
	dispatch(routerRedux.push('/user/login'));
	// routerRedux.push('/user/login')
}

export function errorCallBack(json) {
	notification.error({
		message: 'Request an error',
		description: json.info,
	});
}

export function callbackDeal(response) {
	if (response.code != null && response.code != undefined) {
		if (response.code == 0) {
			return 'successCallBack';
		} else if (response.code == 1) {
			const { dispatch } = store;
			sessionStorage.removeItem('loginUserInfo');
			setAuthority('guest');
			reloadAuthorized();
			dispatch(routerRedux.push('/user/login'));
			// routerRedux.push('/user/login');
			// this.props.history.push('/user/login');
		} else {
			notification.error({
				message: 'Request an error',
				description: response.info,
			});
		}
	}
}
