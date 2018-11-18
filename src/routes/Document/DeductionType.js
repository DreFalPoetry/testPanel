import React, { PureComponent } from 'react';
import { routerRedux } from 'dva/router';
import { createBrowserHistory } from 'history';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import {
	Row,
	Col,
	Form,
	Card,
	Select,
	Icon,
	Avatar,
	List,
	Tooltip,
	Dropdown,
	Menu,
	Input,
	Button,
	Progress,
	InputNumber,
	AutoComplete,
	DatePicker,
	Table,
	Switch,
	Alert,
	Tag,
	Popover,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getDate, getTheFirstDay, getImgUrl } from '../../utils/commonFunc';
import styles from '../Report/report.less';
import { getMonth } from 'date-fns';
import { queryBilling } from '../../services/api';
//ranAdd
const { Search } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
let imgUrl = '';

@Form.create()
@connect(({ report }) => ({
	report,
}))
export default class DeductionTypeDocPage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [
				{
					type: 'CLICK_INJECTION',
					description:
						'Similar to CLICK_SPAMMING but a slier fraudulent way of using a malware to get the credit of last click for an install.',
					uniqueKey: 1,
				},
				{
					type: 'CLICK_SPAMMING',
					description:
						'A fraudulent way of faking a large amount of clicks to try to “steal” the credit of last click for an install',
					uniqueKey: 2,
				},
				{
					type: 'WRONG_APP_VERSION',
					description:
						'The version of an app contradicts the version on Google Play Store or App Store.',
					uniqueKey: 3,
				},
				{
					type: 'DEVICE_MISMATCH',
					description:
						'The received device information contradicts the device targeting settings in the campaign.',
					uniqueKey: 4,
				},
				{
					type: 'COUNTRY_MISMATCH',
					description:
						'The received country information contradicts the country targeting settings in the campaign.',
					uniqueKey: 5,
				},
				{
					type: 'OS_MISMATCH',
					description:
						'The received operating system information contradicts the operating system targeting in the campaign.',
					uniqueKey: 6,
				},
				{
					type: 'IP_FRAUD',
					description:
						'IPs that have been known as the fraudulent IPs and been marked in the database.',
					uniqueKey: 7,
				},
				{
					type: 'FAKE_DEVICE',
					description:
						'Using emulators or duplicated devices to generate fraudulent installs.',
					uniqueKey: 8,
				},
				{
					type: 'FAKE_ATRIBUTION',
					description: `By generating a fake click right after the user installed the
                app, the period of time between install and click is
                abnormal.`,
					uniqueKey: 9,
				},
				{
					type: 'INCENT',
					description: `Incent traffic that flows into an campaign with non-incent
                settings.`,
					uniqueKey: 10,
				},
				{
					type: 'POOR_QUALITY',
					description: `The traffic that cannot meet the criteria of KPI`,
					uniqueKey: 11,
				},
				{
					type: 'NON_APP_STORE',
					description: `Installs that are not from Google Play Store or App Store`,
					uniqueKey: 12,
				},
				{
					type: 'BOTS',
					description: `Invalidated installs from Bot`,
					uniqueKey: 13,
				},
				{
					type: 'THIRD_PART_BLACKLIST',
					description: `The traffic that has been blacklisted by third party`,
					uniqueKey: 14,
				},
				{
					type: 'OS_FRAUD',
					description: `Abnormal and suspicious operating system version that
                could lead to fraudulence.`,
					uniqueKey: 15,
				},
				{
					type: 'FAKE_PURCHASE',
					description: `By using a malware to fake the action of purchasing to try
                to get the credit of an purchase event.`,
					uniqueKey: 16,
				},
			],
			loading: true,
		};
	}

	componentDidMount() {
		this.setState({
			loading: false,
		});
		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_document_deductiontype', timestamp);
	}

	componentWillUnmount() {}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { dataList, loading } = this.state;
		const columns = [
			{
				title: 'Type',
				dataIndex: 'type',
				width: '30%',
			},
			{
				title: 'Description',
				dataIndex: 'description',
			},
		];
		return (
			<div>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				<PageHeaderLayout />
				<Card bordered={false} style={{ marginTop: 30 }}>
					<div className={styles.billingTableWrapper}>
						<Table
							rowKey="uniqueKey"
							columns={columns}
							dataSource={dataList}
							bordered
							loading={loading}
							size="small"
							pagination={false}
							footer={() => {
								return (
									<div>
										<p>
											The description of different types of deduction logs are
											based on the information gathered from several different
											parties. According to these information, we try to
											summarize all the information and come up with the types
											below.
										</p>
									</div>
								);
							}}
						/>
					</div>
				</Card>
			</div>
		);
	}
}
