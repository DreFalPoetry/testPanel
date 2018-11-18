import React, { Component } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { connect } from 'dva';
import { Link } from 'dva/router';
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
	Table,
	notification,
	Spin,
} from 'antd';

//ranAdd
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import DescriptionList from 'components/DescriptionList';
import styles from './MyCampiagn.less';
import { campaignDetails } from '../../services/api';

import { getParam, getImgUrl } from '../../utils/commonFunc';
import { setAuthority } from '../../utils/authority';
import { reloadAuthorized } from '../../utils/Authorized';
import { routerRedux } from 'dva/router';

const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { Description } = DescriptionList;

const columns = [
	{
		title: 'Type',
		dataIndex: 'type',
	},
	{
		title: 'Change From',
		dataIndex: 'old',
	},
	{
		title: 'Change To',
		dataIndex: 'new',
	},
	{
		title: 'Updated At',
		dataIndex: 'gmt_update_at',
	},
];

let imgUrl = '';

//通过@connect进行model的数据传输
@connect(({ campaign, loading }) => ({
	campaign,
	loading: loading.effects['campaign/fetchCampaignsDetail'],
}))
export default class MyCampiagnDetail extends Component {
	state = {
		operationkey: 'tab1',
		campaignsDetails: {},
		targeting: {},
		updates: [],
		creative: {},
		loading: false,
	};
	componentDidMount() {
		let jsonInfo;
		if (this.props.location.state) {
			jsonInfo = this.props.location.state;
		} else {
			jsonInfo = JSON.parse(localStorage.getItem('pubCamDetailInfo'));
		}
		if (jsonInfo) {
			if (jsonInfo.isUpdates) {
				this.setState({
					operationkey: 'tab2',
				});
			}
			this.setState({
				loading: true,
			});
			const response = campaignDetails(jsonInfo.itemId);
			response
				.then(res => {
					return res;
				})
				.then(json => {
					this.setState({
						loading: false,
					});
					if (json.code == 0) {
						if (json.detail) {
							const updates = json.detail.updates;
							const targeting = json.detail.targeting;
							const creative = json.detail.creative;
							this.setState({
								campaignsDetails: json.detail,
								targeting: targeting,
								updates: updates,
								creative: creative,
							});
						} else {
							this.setState({
								campaignsDetails: {},
								targeting: {},
								updates: [],
								creative: {},
							});
						}
					} else if (json.code == 1) {
						sessionStorage.removeItem('loginUserInfo');
						setAuthority('guest');
						reloadAuthorized();
						this.props.dispatch(routerRedux.push('/user/login'));
					} else {
						notification.error({
							message: 'Request an error',
							description: response.info,
						});
					}

					// dispatch({
					//     type: 'campaign/syancCampaignsDetail',
					//     payload: json.detail,
					// });
					// dispatch({
					//     type: 'campaign/syancDetailList',
					//     payload: {updates,targeting,creative},
					// });
				});
		}

		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_campaign_detail', timestamp);
	}

	componentWillReceiveProps(nextProps) {
		let jsonInfo = nextProps.history.location.state;
		if (jsonInfo) {
			this.setState({
				loading: true,
			});
			if (jsonInfo.isUpdates) {
				this.setState({
					operationkey: 'tab2',
				});
			}
			const response = campaignDetails(jsonInfo.itemId);
			response
				.then(res => {
					return res;
				})
				.then(json => {
					this.setState({
						loading: false,
					});
					if (json.code == 0) {
						if (json.detail) {
							const updates = json.detail.updates;
							const targeting = json.detail.targeting;
							const creative = json.detail.creative;
							this.setState({
								campaignsDetails: json.detail,
								targeting: targeting,
								updates: updates,
								creative: creative,
							});
						} else {
							this.setState({
								campaignsDetails: {},
								targeting: {},
								updates: [],
								creative: {},
							});
						}
						// dispatch({
						//     type: 'campaign/syancCampaignsDetail',
						//     payload: json.detail,
						// });
						// dispatch({
						//     type: 'campaign/syancDetailList',
						//     payload: {updates,targeting,creative},
						// });
					} else if (json.code == 1) {
						sessionStorage.removeItem('loginUserInfo');
						setAuthority('guest');
						reloadAuthorized();
						this.props.dispatch(routerRedux.push('/user/login'));
					} else {
						notification.error({
							message: 'Request an error',
							description: response.info,
						});
					}
				});
		}
	}

	onOperationTabChange = (campaignsDetails, key) => {
		this.setState({ operationkey: key });
		if (key == 'tab3') {
			let params = campaignsDetails.id
				? '?infoId=' + campaignsDetails.id + '-' + campaignsDetails.name
				: '';
			let urlOrigin = window.location.origin;
			window.open(urlOrigin + '/#/report/subPublisherWise' + params);
		}
	};

	goBackPage = () => {
		window.history.go(-1);
	};

	clickCreativeLink = (type, url) => {
		if (type == 3 && url) {
			window.open(url);
		}
	};

	render() {
		const { campaign, loading } = this.props;
		const advancedOperation1 = [];
		// const {campaignsDetails,targeting,updates,creative} = campaign;
		const { campaignsDetails, targeting, updates, creative } = this.state;
		const description = (
			<DescriptionList className={styles.headerList} size="small" col="1">
				<Description term="Category">
					{campaignsDetails.category ? campaignsDetails.category : '--'}
				</Description>
				<Description term="Lifetime start">
					{campaignsDetails.active_time ? campaignsDetails.active_time : '--'}
				</Description>
				<Description term="TimeZone">
					{campaignsDetails.timezone != undefined && campaignsDetails.timezone != null
						? campaignsDetails.timezone >= 0
							? 'GMT +' + campaignsDetails.timezone + ' '
							: 'GMT' + campaignsDetails.timezone + ' '
						: '--'}
				</Description>
				<Description term="Daily Cap">
					{campaignsDetails.allocation
						? campaignsDetails.allocation.daily_cap
							? campaignsDetails.allocation.daily_cap
							: 'Open Cap'
						: '--'}
				</Description>
				<Description term="Fraud Description">
					{campaignsDetails.fraud_description ? campaignsDetails.fraud_description : '--'}
				</Description>
				<Description term="KPI Description">
					{campaignsDetails.quality_description
						? campaignsDetails.quality_description
						: '--'}
				</Description>
			</DescriptionList>
		);
		const extra = (
			<Row>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>Price Model</div>
					<div className={styles.heading} style={{ fontSize: '16px' }}>
						{campaignsDetails.allocation
							? campaignsDetails.allocation.payfor +
							  '/' +
							  campaignsDetails.allocation.payout
							: '--'}
					</div>
				</Col>
				<Col xs={24} sm={12}>
					<div className={styles.textSecondary}>Status</div>
					<div className={styles.heading} style={{ fontSize: '16px' }}>
						{campaignsDetails.status ? campaignsDetails.status : '--'}
					</div>
				</Col>
			</Row>
		);
		const contentList = {
			tab1: (
				<div>
					<Card title="Targeting" style={{ marginBottom: 24 }}>
						<Row>
							<Col xs={24} sm={12}>
								<DescriptionList style={{ marginBottom: 24 }} col="1">
									<Description term="Country">
										{targeting.countries ? targeting.countries : '--'}
									</Description>
									<Description term="State or City">
										{targeting.region ? targeting.region : '--'}
									</Description>
									<Description term="Connection Type">
										{targeting.connection_types
											? targeting.connection_types
											: '--'}
									</Description>
									<Description term="Carrier">
										{targeting.carrier ? targeting.carrier : '--'}
									</Description>
									<Description term="Mandatory Device ID">
										{targeting.mandatory_did ? targeting.mandatory_did : '--'}
									</Description>
									<Description term="Sub Publisher">
										{campaignsDetails.sub_publisher
											? campaignsDetails.sub_publisher
											: '--'}
									</Description>
								</DescriptionList>
							</Col>
							<Col xs={24} sm={12}>
								<DescriptionList style={{ marginBottom: 24 }} col="1">
									<Description term="Device Type">
										{targeting.device_types ? targeting.device_types : '--'}
									</Description>
									<Description term="Device Make">
										{targeting.device_makes ? targeting.device_makes : '--'}
									</Description>
									<Description term="Device Model">
										{targeting.device_models ? targeting.device_models : '--'}
									</Description>
									<Description term="OS">
										{targeting.os ? targeting.os : '--'}
									</Description>
									<Description term="OSV">
										{targeting.osv ? targeting.osv : '--'}
									</Description>
								</DescriptionList>
							</Col>
						</Row>
					</Card>
					<Card title="Creative" style={{ marginBottom: 24 }}>
						<DescriptionList style={{ marginBottom: 24 }} col="1">
							<Description term="Preview Link">
								{campaignsDetails.preview_link
									? campaignsDetails.preview_link
									: '--'}
							</Description>
							<Description term="Tracking Link">
								{campaignsDetails.tracking_link
									? campaignsDetails.tracking_link
									: '--'}
							</Description>
							<Description term="Creative">
								{creative.creative ? (
									<a href={creative.creative} target="_blank">
										Click to download
									</a>
								) : (
									''
								)}
							</Description>
							{/* <Link to="/campiagn/myCampiagn"> */}
							<Button
								icon="rollback"
								style={{ float: 'right', marginRight: '5px' }}
								onClick={this.goBackPage}
							>
								Previous Page
							</Button>
							{/* </Link> */}
						</DescriptionList>
					</Card>
				</div>
			),
			tab2: (
				<Card title="Updates" style={{ marginBottom: 24 }}>
					<List
						size="large"
						rowKey="id"
						dataSource={updates}
						renderItem={item => (
							<List.Item>
								<List.Item.Meta
									avatar={<Avatar src={item.icon} shape="square" size="large" />}
									description={
										<div>
											<div
												onClick={this.clickCreativeLink.bind(
													this,
													item.type,
													creative.creative
												)}
												style={
													item.type == 3 && creative.creative
														? { color: '#1890ff', cursor: 'pointer' }
														: null
												}
											>
												{(item.type == 1
													? 'update cap'
													: item.type == 2
														? 'update payout'
														: item.type == 3
															? 'update creative'
															: 'terminate') +
													(item.old
														? ' from ' +
														  item.old +
														  ' to ' +
														  item.new_data
														: '')}
											</div>
											<div>{item.time}</div>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
					{/* <Table
                pagination={false}
                loading={loading}
                    dataSource={updates}
                    columns={columns}
                    bordered
                /> */}
				</Card>
			),
			tab3: (
				<div />
				// <Card title="Targeting" style={{ marginBottom: 24 }}>
				// <Table
				//     pagination={false}
				//     loading={loading}
				//     dataSource={updates}
				//     columns={columns}
				//     bordered
				// />
				// </Card>
			),
		};

		const tabList = [
			{
				key: 'tab1',
				tab: 'Detail',
			},
			{
				key: 'tab2',
				tab: 'Updates',
			},
			{
				key: 'tab3',
				tab: (
					<span>
						<Icon type="link" />Optimize Advice
					</span>
				),
			},
		];

		const breadcrumbList = [
			{
				title: 'Home',
				href: '/',
			},
			{
				title: 'Campaign',
			},
			{
				title: 'My Campaign',
				href: '/campiagn/myCampiagn',
			},
			{
				title: 'Campaign Detail',
			},
		];

		return (
			<Spin spinning={this.state.loading}>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				<PageHeaderLayout
					breadcrumbList={breadcrumbList}
					title={campaignsDetails.id ? campaignsDetails.name : ''}
					logo={<img alt="" src={campaignsDetails.icon ? campaignsDetails.icon : ''} />}
					content={description}
					extraContent={extra}
				>
					<Card
						loading={this.state.loading}
						bordered={false}
						tabList={tabList}
						activeTabKey={this.state.operationkey}
						onTabChange={this.onOperationTabChange.bind(this, campaignsDetails)}
					>
						{contentList[this.state.operationkey]}
					</Card>
				</PageHeaderLayout>
			</Spin>
		);
	}
}
