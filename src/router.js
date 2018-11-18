import React from 'react';
import { routerRedux, Route, Switch } from 'dva/router';
import { LocaleProvider, Spin } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import dynamic from 'dva/dynamic';
import { getRouterData } from './common/router';
import Authorized from './utils/Authorized';
import styles from './index.less';

const { ConnectedRouter } = routerRedux;
const { AuthorizedRoute } = Authorized;
dynamic.setDefaultLoadingComponent(() => {
	return <Spin size="large" className={styles.globalSpin} />;
});

function RouterConfig({ history, app }) {
	const routerData = getRouterData(app);
	//ranChange
	const UserLayout = routerData['/user'].component;
	const BasicLayout = routerData['/'].component;
	return (
		<LocaleProvider>
			<ConnectedRouter history={history}>
				<Switch>
					{/* 根据common文件夹中的router配置进行区分是用户登陆页面和登陆后的菜单显示页面 */}
					<Route path="/user" component={UserLayout} />
					<AuthorizedRoute
						path="/"
						render={props => <BasicLayout {...props} />}
						authority={['admin', 'user']}
						redirectPath="/user/login"
					/>
				</Switch>
			</ConnectedRouter>
		</LocaleProvider>
	);
}

export default RouterConfig;
