import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Tag, Dropdown, Avatar, Divider, Tooltip, AutoComplete } from 'antd';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import NoticeIcon from '../NoticeIcon';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
import { connect } from 'dva';
import {logoDisplay} from '../../utils/logoDisplay';

@connect(({ report }) => ({
	report,
}))
export default class GlobalHeader extends PureComponent {
	componentWillUnmount() {
		this.triggerResizeEvent.cancel();
	}
	getNoticeData() {
		const { notices = [] } = this.props;
		if (notices.length === 0) {
			return {};
		}
		const newNotices = notices.map(notice => {
			const newNotice = { ...notice };
			if (newNotice.datetime) {
				newNotice.datetime = moment(notice.datetime).fromNow();
			}
			// transform id to item key
			if (newNotice.id) {
				newNotice.key = newNotice.id;
			}
			if (newNotice.extra && newNotice.status) {
				const color = {
					todo: '',
					processing: 'blue',
					urgent: 'red',
					doing: 'gold',
				}[newNotice.status];
				newNotice.extra = (
					<Tag color={color} style={{ marginRight: 0 }}>
						{newNotice.extra}
					</Tag>
				);
			}
			return newNotice;
		});
		return groupBy(newNotices, 'type');
	}
	toggle = () => {
		const { collapsed, onCollapse } = this.props;
		onCollapse(!collapsed);
		this.triggerResizeEvent();
	};
	/* eslint-disable*/
	@Debounce(600)
	triggerResizeEvent() {
		const event = document.createEvent('HTMLEvents');
		event.initEvent('resize', true, false);
		window.dispatchEvent(event);
	}

	//搜索Campaign项目
	searchCampaign = value => {
		let searchKey = '';
		if (value.indexOf('-') > -1 && value.split('-')[0].length > 0) {
			searchKey = value.split('-')[0];
		} else {
			searchKey = value;
		}
		this.props.dispatch({
			type: 'report/fetchCampaign',
			payload: { keywords: searchKey },
		});
	};

	//select
	selectCampaign = value => {
		this.props.changePath(value);
	};

	render() {
		const {
			currentUser = {},
			collapsed,
			fetchingNotices,
			isMobile,
			logo,
			onNoticeVisibleChange,
			onMenuClick,
			onNoticeClear,
			login,
			report,
        } = this.props;
		const menu = (
			<Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
				{/* <Menu.Item disabled>
          <Icon type="user" />个人中心
        </Menu.Item>
        <Menu.Item disabled>
          <Icon type="setting" />设置
        </Menu.Item>
        <Menu.Item key="triggerError">
          <Icon type="close-circle" />触发报错
        </Menu.Item>
        <Menu.Divider /> */}
				<Menu.Item key="logout">
					<Icon type="logout" />Logout
				</Menu.Item>
			</Menu>
		);
		return (
			<div className={styles.header}>
                <div className={styles.logo} key="logo">
                    {/* 设置router链接 */}
                    <Link to="/">
                        {logoDisplay('24', 'white')}
                        <span style={{color:'white',float:'right',marginTop:'-3px',marginLeft:'5px'}}>Test</span>
                    </Link>
                </div>
                {/* {menu} */}
			</div>
		);
	}
}
