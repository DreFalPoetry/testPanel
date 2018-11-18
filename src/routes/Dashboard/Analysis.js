/**
 * created by ran 20180604
 */
import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { deepCloneObj } from '../../utils/commonFunc';
import {
	Row,
	Col,
	Icon,
	Card,
	Button,
	Tabs,
	Table,
	Radio,
	DatePicker,
	Tooltip,
	Menu,
	Dropdown,
	List,
	Avatar,
	Progress,
	Spin,
} from 'antd';
import numeral from 'numeral';
import {
	ChartCard,
	yuan,
	MiniArea,
	MiniBar,
	MiniProgress,
	Field,
	Bar,
	Pie,
	TimelineChart,
} from 'components/Charts';
import Trend from 'components/Trend';
import NumberInfo from 'components/NumberInfo';
import { getTimeDistance } from '../../utils/utils';
import { getDate, getImgUrl } from '../../utils/commonFunc';

//ranAdd
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Analysis.less';
import Ellipsis from 'components/Ellipsis';
import moment from 'moment';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
let imgUrl = '';

@connect(({ homepage, loading }) => ({
	homepage,
	loading: loading.effects['homepage/lastestCampaigns'],
}))
export default class Analysis extends Component {
	state = {
		rangePickerValue: [],
		showMoreUpdatesBtn: true,
	};

	componentDidMount() {
		this.setState({
			rangePickerValue: [moment(getDate(29)), moment(getDate(0))],
		});
		//请求后端服务接口数据
		this.props.dispatch({
			type: 'homepage/recent30d',
		});
		this.props.dispatch({
			type: 'homepage/queryByDateRange',
			payload: { start_date: getDate(29), end_date: getDate(0) },
		});
		this.props.dispatch({
			type: 'homepage/lastestCampaigns',
		});
		this.props.dispatch({
			type: 'homepage/latestUpdates',
		});
		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_dashboard', timestamp);
	}

	//在组件销毁的时候清除model中的数据信息
	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'homepage/clear',
		});
	}

	//改变已读和未读状态
	changeReadStatus = () => {
		console.log('已读和未读状态');
	};

	//手动选择日期时
	handleRangePickerChange = (date, dateString) => {
		this.setState({
			rangePickerValue: date,
		});
		this.props.dispatch({
			type: 'homepage/queryByDateRange',
			payload: { start_date: dateString[0], end_date: dateString[1] },
		});
	};

	selectDate = type => {
		this.setState({
			rangePickerValue: getTimeDistance(type),
		});
		if (type == 'month') {
			this.props.dispatch({
				type: 'homepage/queryByDateRange',
				payload: { type: 'monthly' },
			});
		} else if (type == 'year') {
			this.props.dispatch({
				type: 'homepage/queryByDateRange',
				payload: { type: 'yearly' },
			});
		} else {
			this.props.dispatch({
				type: 'homepage/queryByDateRange',
				payload: {
					start_date: getTimeDistance(type)[0].format('YYYY-MM-DD'),
					end_date: getTimeDistance(type)[1].format('YYYY-MM-DD'),
				},
			});
		}
	};

	isActive(type) {
		const { rangePickerValue } = this.state;
		const value = getTimeDistance(type);
		if (!rangePickerValue[0] || !rangePickerValue[1]) {
			return;
		}
		if (
			rangePickerValue[0].isSame(value[0], 'day') &&
			rangePickerValue[1].isSame(value[1], 'day')
		) {
			return styles.currentDate;
		}
	}

	toCampaignDetail = (itemId, isUpdates) => {
		if (isUpdates === true) {
			this.props.history.push({
				pathname: '/campiagn/detail',
				state: { itemId: itemId, isUpdates: true },
			});
			let jsonInfo = { itemId: itemId, isUpdates: true };
			localStorage.setItem('pubCamDetailInfo', JSON.stringify(jsonInfo));
		} else {
			this.props.history.push({ pathname: '/campiagn/detail', state: { itemId: itemId } });
			let jsonInfo = { itemId: itemId };
			localStorage.setItem('pubCamDetailInfo', JSON.stringify(jsonInfo));
		}
	};

	showMoreUpdates = () => {
		const { latestUpdates, updatesShow } = this.props.homepage;
		let tempUpdatesShow = deepCloneObj(updatesShow);
		let arr1 = latestUpdates.slice(updatesShow.length, updatesShow.length + 8);
		if (arr1.length < 8) {
			this.setState({
				showMoreUpdatesBtn: false,
			});
		}
		this.props.dispatch({
			type: 'homepage/asyncLatestUpdatesShow',
			payload: tempUpdatesShow.concat(arr1),
		});
	};

	render() {
		const { rangePickerValue } = this.state;
		const { loading, homepage } = this.props;

		const {
			//服务端获取数据信息
			recent30d,
			queryByDateRange,
			queryByDateRangeSpinning,
			lastestCampaigns,
			latestUpdates,
			updatesShow,
		} = homepage;

		// 按月份或年份筛选
		const salesExtra = (
			<div className={styles.salesExtraWrap}>
				<div className={styles.salesExtra}>
					<a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
						This Week
					</a>
					<a className={this.isActive('month')} onClick={() => this.selectDate('month')}>
						This Month
					</a>
					<a className={this.isActive('year')} onClick={() => this.selectDate('year')}>
						This Year
					</a>
				</div>
				<RangePicker
					value={rangePickerValue}
					onChange={this.handleRangePickerChange}
					style={{ width: 256 }}
				/>
			</div>
		);

		const topColResponsiveProps = {
			xs: 24,
			sm: 12,
			md: 12,
			lg: 12,
			xl: 6,
			style: { marginBottom: 24 },
		};

		return (
			<div>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				{/* 头部公告信息 */}
				{/* <div className={styles.pageHeaderContent}>
                    <div className={styles.announcement}>
                        <span>Announcement</span>
                        <i style={{fontStyle:"normal",color:"#ddb64e",cursor:"pointer"}} onClick={this.changeReadStatus}>&nbsp;&nbsp;mark as read</i>
                    </div>
                    <div className={styles.headerInfoWrapper} style={{display:"flex"}}>
                        <div className={styles.avatar}>
                            <Avatar
                                size="large"
                                src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
                            />
                        </div>
                        <div className={styles.content}>
                            <div className={styles.contentTitle}>早安，{announcement.info?announcement.info:""}，祝你开心每一天！</div>
                            <div>{announcement.info?announcement.info:""}</div>
                        </div>
                    </div>
                </div> */}
				{/* 最近30天收益之类 */}
				<Row gutter={24}>
					<Col {...topColResponsiveProps}>
						<ChartCard
							bordered={false}
							title="Last 30 days Revenue"
							total={`$${numeral(
								recent30d.sum ? recent30d.sum.rev.total : '0'
							).format('0,0.00')}`}
							footer={
								<Field
									label="Daily avg."
									value={`$ ${numeral(
										recent30d.sum ? recent30d.sum.rev.total / 30 : '0'
									).format('0,0.00')}`}
								/>
							}
							contentHeight={46}
						>
							<div style={{ marginRight: 16 }}>
								Increase<span className={styles.trendText}>
									{recent30d.sum ? recent30d.sum.rev.incr + '%' : ''}
								</span>
							</div>
						</ChartCard>
					</Col>
					<Col {...topColResponsiveProps}>
						<ChartCard
							bordered={false}
							title="Last 30 days clicks"
							total={numeral(recent30d.sum ? recent30d.sum.clk.total : '0').format(
								'0,0'
							)}
							footer={
								<Field
									label="Daily avg."
									value={numeral(
										recent30d.sum ? recent30d.sum.clk.total / 30 : '0'
									).format('0,0')}
								/>
							}
							contentHeight={46}
						>
							<MiniArea
								color="#975FE4"
								data={recent30d.sum ? recent30d.sum.clk.each : []}
							/>
						</ChartCard>
					</Col>
					<Col {...topColResponsiveProps}>
						<ChartCard
							bordered={false}
							title="Last 30 days conversions"
							total={numeral(recent30d.sum ? recent30d.sum.conv.total : '0').format(
								'0,0'
							)}
							footer={
								<Field
									label="Daily avg."
									value={numeral(
										recent30d.sum ? recent30d.sum.conv.total / 30 : '0'
									).format('0,0')}
								/>
							}
							contentHeight={46}
						>
							<MiniArea data={recent30d.sum ? recent30d.sum.conv.each : []} />
						</ChartCard>
					</Col>
					<Col {...topColResponsiveProps}>
						<ChartCard
							bordered={false}
							title="Campaigns"
							total={
								recent30d.camp
									? numeral(recent30d.camp.total).format('0,0') + ' In-Progress'
									: '0 In-Progress'
							}
							footer={
								<Field
									label="Today Deliveried"
									value={
										recent30d.camp
											? numeral(recent30d.camp.deliveried).format('0,0')
											: ''
									}
								/>
							}
							contentHeight={46}
						>
							<div>
								Daily Cap{' '}
								<span style={{ color: '#000' }}>
									{recent30d.camp
										? numeral(recent30d.camp.caps).format('0,0')
										: ''}
								</span>{' '}
							</div>
						</ChartCard>
					</Col>
				</Row>

				{/* conversions */}
				<Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
					<div className={styles.salesCard}>
						<Tabs
							tabBarExtraContent={salesExtra}
							size="large"
							tabBarStyle={{ marginBottom: 24 }}
						>
							<TabPane tab="Conversion" key="sales">
								<Spin spinning={queryByDateRangeSpinning}>
									<Row>
										{/* 转换趋势 */}
										<Col xl={16} lg={12} md={12} sm={24} xs={24}>
											<div className={styles.salesBar}>
												<Bar
													height={391}
													title="Conversion Trend"
													data={
														queryByDateRange.conv
															? queryByDateRange.conv.each
															: []
													}
												/>
											</div>
										</Col>
										{/* 转换列表 */}
										<Col xl={8} lg={12} md={12} sm={24} xs={24}>
											<div className={styles.salesRank}>
												<div>
													<h4 className={styles.rankingTitle}>
														Top 10 Campaign
														<span
															style={{ float: 'right' }}
															className={styles.rankingTitle}
														>
															Conversion
														</span>
													</h4>
												</div>
												<ul className={styles.rankingList}>
													{queryByDateRange.conv
														? queryByDateRange.conv.top10.map(
																(item, i) => (
																	<li
																		key={i}
																		onClick={this.toCampaignDetail.bind(
																			this,
																			item.id
																		)}
																		style={{
																			cursor: 'pointer',
																		}}
																	>
																		<span
																			className={
																				i < 3
																					? styles.active
																					: ''
																			}
																		>
																			{i + 1}
																		</span>
																		<span
																			title={
																				item.id +
																				' ' +
																				item.name +
																				' ' +
																				item.countries +
																				' ' +
																				item.os
																			}
																		>
																			{item.id +
																				' ' +
																				item.name +
																				' ' +
																				item.countries +
																				' ' +
																				item.os}
																		</span>
																		<span>
																			{numeral(
																				item.cnt
																			).format('0,0')}
																		</span>
																	</li>
																)
														  )
														: ''}
												</ul>
											</div>
										</Col>
									</Row>
								</Spin>
							</TabPane>
							<TabPane tab="Click" key="views">
								<Spin spinning={queryByDateRangeSpinning}>
									<Row>
										{/* 点击量趋势 */}
										<Col xl={16} lg={12} md={12} sm={24} xs={24}>
											<div className={styles.salesBar}>
												<Bar
													height={391}
													title="Clicks Trend"
													data={
														queryByDateRange.clk
															? queryByDateRange.clk.each
															: []
													}
												/>
											</div>
										</Col>
										{/* 点击量列表 */}
										<Col xl={8} lg={12} md={12} sm={24} xs={24}>
											<div className={styles.salesRank}>
												<div>
													<h4 className={styles.rankingTitle}>
														Top 10 Campaign
														<span
															style={{ float: 'right' }}
															className={styles.rankingTitle}
														>
															Click
														</span>
													</h4>
												</div>
												<ul className={styles.rankingList}>
													{queryByDateRange.clk
														? queryByDateRange.clk.top10.map(
																(item, i) => (
																	<li
																		key={i}
																		onClick={this.toCampaignDetail.bind(
																			this,
																			item.id
																		)}
																		style={{
																			cursor: 'pointer',
																		}}
																	>
																		<span
																			className={
																				i < 3
																					? styles.active
																					: ''
																			}
																		>
																			{i + 1}
																		</span>
																		<span
																			title={
																				item.id +
																				' ' +
																				item.name +
																				' ' +
																				item.countries +
																				' ' +
																				item.os
																			}
																		>
																			{item.id +
																				' ' +
																				item.name +
																				' ' +
																				item.countries +
																				' ' +
																				item.os}
																		</span>
																		<span>
																			{numeral(
																				item.cnt
																			).format('0,0')}
																		</span>
																	</li>
																)
														  )
														: ''}
												</ul>
											</div>
										</Col>
									</Row>
								</Spin>
							</TabPane>
						</Tabs>
					</div>
				</Card>
				{/* New Campaign */}
				<Card
					className={styles.campaignBrand}
					title={
						<div>
							<span>Hot Campaigns</span>
							<span>(Campaigns below are open to run)</span>
						</div>
					}
					bordered={false}
					style={{ marginTop: 32, padding: 0 }}
					bodyStyle={{ padding: '0px' }}
				>
					<div className={styles.cardList} style={{ marginBottom: '0px' }}>
						<List
							rowKey="uniqueKey"
							loading={loading}
							grid={{ gutter: 0, lg: 3, md: 2, sm: 1, xs: 1 }}
							dataSource={lastestCampaigns}
							renderItem={item => (
								<List.Item key={item.uniqueKey} style={{ marginBottom: 0 }}>
									<Card
										hoverable
										className={styles.card}
										onClick={this.toCampaignDetail.bind(this, item.id)}
									>
										<Card.Meta
											avatar={
												<img
													alt=""
													className={styles.cardAvatar}
													src={item.icon ? item.icon : ''}
												/>
											}
											title={<span>{item.id + ' ' + item.name}</span>}
											description={
												<div>
													<Ellipsis className={styles.item} lines={3}>
														{(item.category
															? item.category + ', '
															: '') +
															item.kpi +
															' kpi,' +
															' ' +
															'daily Cap:' +
															item.daily_cap}
													</Ellipsis>
													<div className={styles.footerTime}>
														<span>
															{item.payfor + '/' + item.payout}
														</span>
														<i style={{ fontStyle: 'normal' }}>
															{item.created_at ? item.created_at : ''}
														</i>
													</div>
												</div>
											}
										/>
									</Card>
								</List.Item>
							)}
						/>
						{lastestCampaigns.length && lastestCampaigns.length >= 9 ? (
							<div style={{ padding: '10px 20px', textAlign: 'right' }}>
								<Link to="/campiagn/myCampiagn">More>></Link>
							</div>
						) : null}
					</div>
				</Card>

				{/* Last 7 days updates */}
				<Card
					className={`${styles.campaignBrand} ${styles.updatesWrapper}`}
					title="Updates in past 7 days"
					bordered={false}
					style={{ marginTop: 32, padding: 0 }}
				>
					<List
						size="large"
						rowKey="uniqueKey"
						loading={loading}
						dataSource={updatesShow}
						renderItem={item => (
							<List.Item>
								<List.Item.Meta
									avatar={<Avatar src={item.icon} shape="square" size="large" />}
									onClick={this.toCampaignDetail.bind(this, item.id, true)}
									description={
										<div>
											<div>{item.id + ' ' + item.name}</div>
											<div>
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
														: '') +
													' ' +
													item.time}
											</div>
										</div>
									}
								/>
							</List.Item>
						)}
					/>
					{latestUpdates.length > 8 ? (
						this.state.showMoreUpdatesBtn ? (
							<div style={{ textAlign: 'center' }}>
								<Button onClick={this.showMoreUpdates}>Show more</Button>
							</div>
						) : null
					) : null}
				</Card>
			</div>
		);
	}
}
