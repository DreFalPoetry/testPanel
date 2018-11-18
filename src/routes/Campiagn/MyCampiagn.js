/**
 * created by Ran 20180606
 */
import React, { Component } from 'react';
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
	TreeSelect,
	Badge,
} from 'antd';

//ranAdd
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './MyCampiagn.less';
import {
	getProgressSpeed,
	splicingCharacter,
	deepCloneObj,
	getProgressSpeedByCaps,
	getImgUrl,
} from '../../utils/commonFunc';
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;

const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const UnderBoostedTitle = (
	<div>
		<div>Campaigns are running with insufficient amount of traffic.</div>
		<div>These campaigns need your boosting for traffic.</div>
	</div>
);

let imgUrl = '';

//通过@connect进行model的数据传输
@connect(({ campaign, loading }) => ({
	campaign,
	loading: loading.effects['campaign/filterCampaigns'],
}))
export default class MyCampiagn extends Component {
	constructor(props) {
		super(props);
		this.state = {
			page_no: 1,
			page_size: 20,
			value: [],
			keywords: '',
		};
	}

	componentDidMount() {
		this.props.dispatch({
			type: 'campaign/myCampaigns',
		});
		this.props.dispatch({
			type: 'campaign/filterCampaigns',
			payload: { page_no: 1, page_size: 20 },
		});

		//获取下拉框的list数据信息
		this.props.dispatch({
			type: 'campaign/getFilterList',
		});
		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_mycampaign', timestamp);
	}

	//树形选择发生变化的时候
	changeTreeVal = value => {
		this.setState(
			{
				value: value,
				page_no: 1,
			},
			function() {
				const { value, page_no, page_size, keywords } = this.state;
				this.props.dispatch({
					type: 'campaign/filterCampaigns',
					payload: {
						page_no: page_no,
						page_size: page_size,
						tree_param: value,
						keywords: keywords,
					},
				});
			}
		);
	};

	//获取搜索框中的值
	getSearchVal = value => {
		this.setState(
			{
				keywords: value,
				page_no: 1,
			},
			function() {
				const { value, page_no, page_size, keywords } = this.state;
				this.props.dispatch({
					type: 'campaign/filterCampaigns',
					payload: {
						page_no: page_no,
						page_size: page_size,
						tree_param: value,
						keywords: keywords,
					},
				});
			}
		);
	};

	//点击下一页或上一页操作
	pageChange = (page, pageSize) => {
		this.setState(
			{
				page_no: page,
				page_size: pageSize,
			},
			function() {
				const { value, keywords, page_no, page_size } = this.state;
				this.props.dispatch({
					type: 'campaign/filterCampaigns',
					payload: {
						page_no: page_no,
						page_size: page_size,
						tree_param: value,
						keywords: keywords,
					},
				});
			}
		);
	};

	//每页条数发生变化
	onShowSizeChange = (current, size) => {
		this.setState(
			{
				page_no: 1,
				page_size: size,
			},
			function() {
				const { page_no, page_size, value, keywords } = this.state;
				this.props.dispatch({
					type: 'campaign/filterCampaigns',
					payload: {
						page_no: page_no,
						page_size: page_size,
						tree_param: value,
						keywords: keywords,
					},
				});
			}
		);
	};

	//进入详情页面
	enterHandle = (id, isUpdates) => {
		if (isUpdates === true) {
			this.props.history.push({
				pathname: '/campiagn/detail',
				state: { itemId: id, isUpdates: true },
			});
			let jsonInfo = { itemId: id, isUpdates: true };
			localStorage.setItem('pubCamDetailInfo', JSON.stringify(jsonInfo));
		} else {
			this.props.history.push({ pathname: '/campiagn/detail', state: { itemId: id } });
			let jsonInfo = { itemId: id };
			localStorage.setItem('pubCamDetailInfo', JSON.stringify(jsonInfo));
		}
	};

	// 三个tab页选中得时候
	tabfilter = type => {
		let tempValue = deepCloneObj(this.state.value);
		if (type == 1) {
			if (tempValue.indexOf('status_8') < 0) {
				tempValue.push('status_8');
				this.setState(
					{
						value: tempValue,
						page_no: 1,
					},
					function() {
						const { value, page_no, page_size, keywords } = this.state;
						this.props.dispatch({
							type: 'campaign/filterCampaigns',
							payload: {
								page_no: page_no,
								page_size: page_size,
								tree_param: value,
								keywords: keywords,
							},
						});
					}
				);
			}
		} else if (type == 2) {
			if (tempValue.indexOf('hot_all') < 0) {
				tempValue.push('hot_all');
				this.setState(
					{
						value: tempValue,
						page_no: 1,
					},
					function() {
						const { value, page_no, page_size, keywords } = this.state;
						this.props.dispatch({
							type: 'campaign/filterCampaigns',
							payload: {
								page_no: page_no,
								page_size: page_size,
								tree_param: value,
								keywords: keywords,
							},
						});
					}
				);
			}
		} else if (type == 3) {
			if (tempValue.indexOf('latest_all') < 0) {
				tempValue.push('latest_all');
				this.setState(
					{
						value: tempValue,
						page_no: 1,
					},
					function() {
						const { value, page_no, page_size, keywords } = this.state;
						this.props.dispatch({
							type: 'campaign/filterCampaigns',
							payload: {
								page_no: page_no,
								page_size: page_size,
								tree_param: value,
								keywords: keywords,
							},
						});
					}
				);
			}
		}
	};

	render() {
		const { campaign, loading } = this.props;
		const { myCampaigns, total, pageSize, campsList, filterList } = campaign;

		const Info = ({ title, value, bordered }) => (
			<div className={styles.infoShowBold}>
				<span>{title}</span>
				<p>{value}</p>
				{bordered && <em />}
			</div>
		);

		const selectTreeProps = {
			allowClear: true,
			treeData: filterList,
			value: this.state.value,
			onChange: this.changeTreeVal,
			treeCheckable: true,
			showCheckedStrategy: SHOW_PARENT,
			searchPlaceholder: 'Please select',
			treeNodeFilterProp: 'label',
			style: {
				width: '40%',
			},
		};

		const filterInfo = (
			<div className={styles.extraContent}>
				<Row>
					<Col sm={{ span: 16 }} xs={{ span: 24 }}>
						<div className={styles.selectWrapper}>
							<label>Filtered by</label>
							<TreeSelect
								{...selectTreeProps}
								dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							/>
						</div>
					</Col>
					<Col sm={{ span: 8 }} xs={{ span: 24 }}>
						<Search
							style={{ width: '65%' }}
							placeholder="Search by ID, Name"
							onSearch={this.getSearchVal}
						/>
					</Col>
				</Row>
			</div>
		);

		const paginationProps = {
			showSizeChanger: true,
			pageSize: pageSize,
			total: total,
			current: this.state.page_no,
			pageSizeOptions: ['10', '20', '30', '50', '100'],
			onChange: this.pageChange,
			onShowSizeChange: this.onShowSizeChange,
		};

		const ListContent = ({ data }) => (
			<div className={styles.listContent}>
				<div className={styles.detailsWrapper}>
					<div
						className={styles.listContentItem}
						style={{ width: '40%', marginRight: '20px' }}
					>
						<span>Daily Cap</span>
						<p>{data ? (data.daily_cap ? data.daily_cap : 'Open Cap') : ''}</p>
					</div>
					<div className={styles.listContentItem} style={{ width: '40%' }}>
						<span>Price Model</span>
						<p>{data ? data.payfor + '/' + data.payout : ''}</p>
					</div>
				</div>
				<div className={styles.listContentItem}>
					<Progress
						percent={
							data ? getProgressSpeedByCaps(data.delived_caps, data.daily_cap) : 0
						}
						strokeWidth={6}
						style={{ width: 120 }}
						showInfo={false}
					/>
					<span style={{ marginLeft: 20 }}>{data ? data.expire_time : ''}</span>
				</div>
			</div>
		);

		return (
			<div className={styles.campiagnHeader}>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				<PageHeaderLayout />
				{/* 头部信息 */}
				<Card bordered={false}>
					<Row>
						<Col
							sm={8}
							xs={24}
							style={{
								padding: '24px',
								borderRight: '1px solid #e8e8e8',
								textAlign: 'center',
								cursor: 'pointer',
							}}
							onClick={this.tabfilter.bind(this, 1)}
						>
							<Info
								title="In-Progress"
								value={
									myCampaigns.inprogress
										? myCampaigns.inprogress + ' Campaigns'
										: '0 Campaigns'
								}
								bordered
							/>
						</Col>
						<Col
							sm={8}
							xs={24}
							style={{
								padding: '24px',
								borderRight: '1px solid #e8e8e8',
								textAlign: 'center',
								cursor: 'pointer',
							}}
							onClick={this.tabfilter.bind(this, 2)}
						>
							<Info
								title={
									<div>
										Under-Boosted Campaigns &nbsp;
										<Tooltip title={UnderBoostedTitle}>
											<Icon type="info-circle" theme="outlined" />
										</Tooltip>
									</div>
								}
								value={myCampaigns.news ? myCampaigns.news : '0'}
							/>
						</Col>
						<Col
							sm={8}
							xs={24}
							style={{ padding: '24px', textAlign: 'center', cursor: 'pointer' }}
							onClick={this.tabfilter.bind(this, 3)}
						>
							<Info
								title="Last 7 days"
								value={
									myCampaigns.updates
										? myCampaigns.updates + ' Updates'
										: '0 Updates'
								}
								bordered
							/>
						</Col>
					</Row>
				</Card>
				{/* body体信息 */}
				<Card
					bordered={false}
					style={{ marginTop: 30 }}
					bodyStyle={{ padding: '0 32px 40px 32px' }}
					extra={filterInfo}
				>
					<List
						size="large"
						rowKey="uniqueKey"
						loading={loading}
						pagination={paginationProps}
						dataSource={campsList}
						renderItem={item => (
							<List.Item
								actions={[
									<a onClick={this.enterHandle.bind(this, item.id)}>Detail</a>,
								]}
							>
								<List.Item.Meta
									avatar={
										<Avatar
											style={{ margin: '5px 0px' }}
											src={item.icon ? item.icon : ''}
											shape="square"
											size="large"
										/>
									}
									title={<span>{item.struct_name}</span>}
									description={
										<div>
											<span>
												{splicingCharacter(
													// item.platform,
													// item.country,
													item.category,
													item.kpi ? item.kpi + ' KPI' : '',
													item.currency
												)}
											</span>
											<span style={{ marginLeft: '10px' }}>
												{item.status == 'Pending' ? (
													<Badge status="warning" text="Pending" />
												) : item.status == 'In-Progress' ? (
													<Badge status="success" text="In-Progress" />
												) : (
													<Badge status="default" text="Paused" />
												)}
											</span>
											{item.update ? (
												<a
													style={{
														cursor: 'pointer',
														// marginLeft: '10px',
														display: 'block',
													}}
													onClick={this.enterHandle.bind(
														this,
														item.id,
														true
													)}
												>
													{(item.update.type == 1
														? 'update cap'
														: item.update.type == 2
															? 'update payout'
															: item.update.type == 3
																? 'update creative'
																: 'terminate') +
														(item.update.old
															? ' from ' +
															  item.update.old +
															  ' to ' +
															  item.update.new_data
															: '')}
												</a>
											) : null}
										</div>
									}
								/>
								<ListContent data={item} />
							</List.Item>
						)}
					/>
				</Card>
			</div>
		);
	}
}
