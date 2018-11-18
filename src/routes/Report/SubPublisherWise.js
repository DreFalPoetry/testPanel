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
	DatePicker,
	AutoComplete,
	Table,
	Switch,
	Alert,
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getDate, getTheFirstDay, getParam, getImgUrl } from '../../utils/commonFunc';
import styles from './report.less';
//ranAdd
const { Search } = Input;
const { Option } = Select;
const FormItem = Form.Item;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const optimizeAdviceTitle = (
	<div>
		<div>Scale Up means to boost up the traffic of this campaign.</div>
		<div>Optimize means to control the fraud rate and to meet the KPI of this campaign.</div>
	</div>
);

let imgUrl = '';

@Form.create()
@connect(({ report, loading }) => ({
	report,
	loading: loading.effects['report/fetch'],
}))
export default class SubPublisherWise extends PureComponent {
	constructor(props) {
		super(props);
		this.selectDate1 = getTheFirstDay();
		this.selectDate2 = getDate(0);
		this.isGmt = 1;
		this.campaignId = null;
		this.state = {
			start_date: getTheFirstDay(),
			end_date: getDate(0),
			page_no: 1,
			page_size: 20,
			is_gmt: 1,
			campaign_id: null,
			campaignNameAndId: '',
			sort_fields: null,
			sort_types: null,
		};
	}

	componentDidMount() {
		let urlParam = getParam('infoId');
		if (urlParam) {
			this.campaignId = Number(urlParam.split('-')[0]);
			this.setState(
				{
					campaign_id: Number(urlParam.split('-')[0]),
					campaignNameAndId: urlParam,
				},
				function() {
					this.props.dispatch({
						type: 'report/fetch',
						payload: {
							is_sub: 1,
							page_no: 1,
							page_size: 20,
							start_date: getTheFirstDay(),
							end_date: getDate(0),
							is_gmt: 1,
							campaign_id: this.state.campaign_id,
						},
					});
				}
			);
		} else {
			this.props.dispatch({
				type: 'report/fetch',
				payload: {
					is_sub: 1,
					page_no: 1,
					page_size: 20,
					start_date: getTheFirstDay(),
					end_date: getDate(0),
					is_gmt: 1,
				},
			});
		}

		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_report_subreport', timestamp);
	}

	componentWillUnmount() {
		const { dispatch } = this.props;
		dispatch({
			type: 'report/clear',
		});
	}

	//select
	selectCampaign = value => {
		this.campaignId = value;
	};

	//搜索Campaign项目
	searchCampaign = value => {
		this.campaignId = null;
		this.props.dispatch({
			type: 'report/fetchCampaign',
			payload: { keywords: value },
		});
	};

	//点击下一页或上一页操作
	pageChange = (page, pageSize) => {
		this.setState(
			{
				page_no: page,
				page_size: pageSize,
			},
			function() {
				const {
					start_date,
					page_no,
					end_date,
					page_size,
					is_gmt,
					campaign_id,
					sort_fields,
					sort_types,
				} = this.state;
				this.props.dispatch({
					type: 'report/fetch',
					payload: {
						is_sub: 1,
						start_date: start_date,
						end_date: end_date,
						page_no: page_no,
						page_size: page_size,
						is_gmt: is_gmt,
						campaign_id: campaign_id,
						sort_fields: sort_fields,
						sort_types: sort_types,
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
				const {
					start_date,
					page_no,
					end_date,
					page_size,
					is_gmt,
					campaign_id,
					sort_fields,
					sort_types,
				} = this.state;
				this.props.dispatch({
					type: 'report/fetch',
					payload: {
						is_sub: 1,
						start_date: start_date,
						end_date: end_date,
						page_no: page_no,
						page_size: page_size,
						is_gmt: is_gmt,
						campaign_id: campaign_id,
						sort_fields: sort_fields,
						sort_types: sort_types,
					},
				});
			}
		);
	};

	//搜索栏日期发生变化
	dateChange = (dates, dateStrings) => {
		this.selectDate1 = dateStrings[0];
		this.selectDate2 = dateStrings[1];
	};

	//点击query按钮
	queryList = e => {
		e.preventDefault();
		this.setState(
			{
				page_no: 1,
				start_date: this.selectDate1,
				end_date: this.selectDate2,
				is_gmt: this.isGmt,
				campaign_id: this.campaignId,
			},
			function() {
				const {
					start_date,
					page_no,
					end_date,
					page_size,
					is_gmt,
					campaign_id,
					sort_fields,
					sort_types,
				} = this.state;
				this.props.dispatch({
					type: 'report/fetch',
					payload: {
						is_sub: 1,
						page_no: page_no,
						page_size: page_size,
						start_date: start_date,
						end_date: end_date,
						is_gmt: is_gmt,
						campaign_id: campaign_id,
						sort_fields: sort_fields,
						sort_types: sort_types,
					},
				});
			}
		);
	};

	//切换时区
	changeGmt = checked => {
		if (checked) {
			this.isGmt = 0;
		} else {
			this.isGmt = 1;
		}
	};

	clickToBilling = () => {
		if (this.state.end_date) {
			this.props.history.push({
				pathname: '/billing',
				state: {
					month: `${this.state.end_date.split('-')[0]}-${
						this.state.end_date.split('-')[1]
					}`,
				},
			});
		} else {
			this.props.history.push({ pathname: '/billing', state: { month: '' } });
		}
	};

	handleTableChange = (pagination, filters, sorter) => {
		if (sorter.field && sorter.order) {
			this.setState(
				{
					sort_fields: sorter.field,
					sort_types: sorter.order == 'descend' ? 'desc' : 'asc',
				},
				function() {
					const {
						start_date,
						page_no,
						end_date,
						page_size,
						is_gmt,
						campaign_id,
						sort_fields,
						sort_types,
					} = this.state;
					this.props.dispatch({
						type: 'report/fetch',
						payload: {
							is_sub: 1,
							page_no: page_no,
							page_size: page_size,
							start_date: start_date,
							end_date: end_date,
							is_gmt: is_gmt,
							campaign_id: campaign_id,
							sort_fields: sort_fields,
							sort_types: sort_types,
						},
					});
				}
			);
		} else {
			if (
				pagination.current == this.state.page_no &&
				pagination.pageSize == this.state.page_size
			) {
				this.setState(
					{
						sort_fields: null,
						sort_types: null,
					},
					function() {
						const {
							start_date,
							page_no,
							end_date,
							page_size,
							is_gmt,
							campaign_id,
							sort_fields,
							sort_types,
						} = this.state;
						this.props.dispatch({
							type: 'report/fetch',
							payload: {
								is_sub: 1,
								page_no: page_no,
								page_size: page_size,
								start_date: start_date,
								end_date: end_date,
								is_gmt: is_gmt,
								campaign_id: campaign_id,
								sort_fields: sort_fields,
								sort_types: sort_types,
							},
						});
					}
				);
			}
		}
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { report, loading } = this.props;
		const { dataList, total, pageSize, dataSource, totalRow } = report;

		const columns = [
			{
				title: 'Campaign',
				children: [
					{
						title: (
							<p style={{ marginBottom: '0px' }}>
								{(total ? total : '0') + '  Campaigns'}
							</p>
						),
						dataIndex: 'group_id',
						render: (text, record) => {
							return text + (record.name ? '-' + record.name : '');
						},
						width: '12%',
					},
				],
			},
			{
				title: 'Sub Publisher',
				children: [
					{
						title: totalRow.aff_pub,
						dataIndex: 'aff_pub',
						width: '14%',
					},
				],
			},
			{
				title: 'Clicks',
				dataIndex: 'gross_clks',
				children: [
					{
						title: (filters, sortOrder) => (
							<div>
								<p style={{ marginBottom: '0px' }}>
									{'total ' + numeral(totalRow.gross_clks).format('0,0')}
								</p>
								<p style={{ marginBottom: '0px' }}>
									{'Daily avg.  ' +
										numeral(parseInt(totalRow.gross_clks / total)).format(
											'0,0'
										)}
								</p>
							</div>
						),
						dataIndex: 'gross_clks',
						sorter: true,
						width: '11%',
						render: text => numeral(text).format('0,0'),
					},
				],
			},
			{
				title: 'Conversions',
				dataIndex: 'gross_cons',
				children: [
					{
						title: (filters, sortOrder) => (
							<div>
								<p style={{ marginBottom: '0px' }}>
									{'total ' + numeral(totalRow.notify_cons).format('0,0')}
								</p>
								<p style={{ marginBottom: '0px' }}>
									{'Daily avg.  ' +
										numeral(parseInt(totalRow.notify_cons / total)).format(
											'0,0'
										)}
								</p>
							</div>
						),
						dataIndex: 'gross_cons',
						sorter: true,
						width: '11%',
						render: text => numeral(text).format('0,0'),
					},
				],
			},
			{
				title: 'CVR%',
				dataIndex: 'cvr',
				children: [
					{
						title: totalRow.cvr,
						sorter: true,
						dataIndex: 'cvr',
						width: '7%',
					},
				],
			},
			{
				title: 'Fraud%',
				dataIndex: 'fraud',
				children: [
					{
						title: totalRow.fraud,
						dataIndex: 'fraud',
						sorter: true,
						width: '8%',
						render: (text, record) => {
							let tips;
							let tipsTextArr = [];
							let tipsText = '';
							if (
								record.invalid_type &&
								JSON.stringify(record.invalid_type) != '{}'
							) {
								tips = record.invalid_type;
							}

							if (tips) {
								for (let i in tips) {
									tipsTextArr.push({
										type: i,
										point: (tips[i] * 100).toFixed(2) + '%',
									});
								}
							}
							tipsText = (
								<div>
									{tipsTextArr.map((item, index) => {
										return (
											<div key={index}>{item.type + ': ' + item.point}</div>
										);
									})}
								</div>
							);
							return <Tooltip title={tipsText}>{text}</Tooltip>;
						},
					},
				],
			},
			{
				title: 'KPI Achieved%',
				dataIndex: 'kpi',
				children: [
					{
						title: '',
						dataIndex: 'kpi',
						width: '12%',
					},
				],
			},
			{
				title: 'KPI Required%',
				dataIndex: 'kpi_required',
				children: [
					{
						title: '',
						dataIndex: 'kpi_required',
						width: '12%',
					},
				],
			},
			{
				title: (
					<span>
						Optimize Advice{' '}
						<Tooltip title={optimizeAdviceTitle}>
							<Icon type="info-circle" theme="outlined" />
						</Tooltip>
					</span>
				),
				children: [
					{
						title: '',
						dataIndex: 'advice',
						width: '12%',
					},
				],
			},
		];

		return (
			<div>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				<PageHeaderLayout />
				<Card bordered={false} style={{ marginTop: 30 }}>
					<div className={styles.searchForm}>
						<Form onSubmit={this.queryList} layout="inline">
							<Row gutter={{ md: 8, lg: 24, xl: 48 }}>
								<Col md={12} sm={24}>
									<FormItem label="Date Range">
										{getFieldDecorator('date', {
											initialValue: [
												moment(getTheFirstDay()),
												moment(getDate(0)),
											],
										})(
											<RangePicker
												style={{ width: '230px' }}
												onChange={this.dateChange}
											/>
										)}
									</FormItem>
								</Col>
								<Col md={8} sm={24}>
									<FormItem
										label={
											<span>
												<Tooltip title="GMT+0 is default time zone for the report. To check advertiser time zone, please turn it on.">
													<Icon type="info-circle" theme="outlined" />
												</Tooltip>
												&nbsp;Campaign Time Zone
											</span>
										}
									>
										{getFieldDecorator('is_gmt')(
											<Switch onChange={this.changeGmt} />
										)}
									</FormItem>
								</Col>
							</Row>
							<Row>
								<Col md={12} sm={24}>
									<FormItem label="Campaign">
										{getFieldDecorator('status3', {
											initialValue: this.state.campaignNameAndId,
										})(
											<AutoComplete
												dataSource={dataSource}
												style={{ width: '230px' }}
												onSelect={this.selectCampaign}
												onSearch={this.searchCampaign}
												placeholder="search"
											/>
										)}
									</FormItem>
								</Col>
								<span style={{ float: 'right', marginBottom: 24 }}>
									<Button type="primary" htmlType="submit">
										Query
									</Button>
								</span>
							</Row>
						</Form>
					</div>
					<div className={styles.addTotalRow}>
						<Alert
							style={{ padding: '5px 10px' }}
							description={
								<span>
									Report is only for your reference. Final number will go for{' '}
									<a style={{ cursor: 'pointer' }} onClick={this.clickToBilling}>
										monthly statement
									</a>{' '}
									confirmed by your account manager.
								</span>
							}
							type="info"
							closable
						/>
						<Table
							columns={columns}
							dataSource={dataList}
							bordered
							rowKey="uniqueKey"
							loading={loading}
							onChange={this.handleTableChange}
							size="small"
							pagination={{
								total: total,
								defaultCurrent: 1,
								current: this.state.page_no,
								pageSize: pageSize,
								onChange: this.pageChange,
								showSizeChanger: true,
								pageSizeOptions: ['10', '20', '30', '50', '100'],
								onShowSizeChange: this.onShowSizeChange,
							}}
							scroll={{ y: 540 }}
						/>
					</div>
				</Card>
			</div>
		);
	}
}
