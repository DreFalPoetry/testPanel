import React, { PureComponent } from 'react';
import { routerRedux, Link } from 'dva/router';
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
export default class BillingPage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			month: moment()
				.subtract(1, 'months')
				.format('YYYY-MM'),
			contentText: '',
			noInfoMessage: '',
			dataList: [],
			loading: true,
		};
	}

	componentDidMount() {
		if (this.props.location.state) {
			this.setState(
				{
					month: this.props.location.state.month,
				},
				function() {
					this.queryData();
				}
			);
		} else {
			this.queryData();
		}
		let timestamp = new Date().getTime();
		imgUrl = getImgUrl('PUB_billing', timestamp);
	}

	queryData = () => {
		let data = { month: this.state.month };
		const response = queryBilling(data);
		response.then(res => {
			this.setState({
				loading: false,
			});
			if (res.code == 0) {
				let tempData = res.entries;
				tempData.filter((item, index) => {
					item.uniqueKey = index + 1;
				});
				this.setState({
					dataList: tempData,
					noInfoMessage: '',
				});
			} else if (res.code == 1) {
				this.setState({
					dataList: [],
					noInfoMessage: res.info,
				});
			}
		});
	};

	componentWillUnmount() {}

	//搜索栏日期发生变化
	dateChange = (dates, dateStrings) => {
		this.setState({
			month: dateStrings,
		});
	};

	//点击query按钮
	queryList = e => {
		e.preventDefault();
		this.setState({
			loading: true,
		});
		this.queryData();
	};

	showAttachment(attachment) {
		// let text = attachment.map((item, index) => {
		// 	return <a href={item} target="_blank" key={index}>{`attach ${index + 1}`}</a>;
		// });
		return (
			<div>
				{attachment.map((item, index) => {
					return (
						<a href={item} target="_blank" key={index} style={{ marginRight: '5px' }}>
							<Icon type="file" />
						</a>
					);
				})}
			</div>

			// <Tooltip title={text}>
			// 	<Tag color="blue">att</Tag>
			// </Tooltip>
		);
	}

	render() {
		const { getFieldDecorator } = this.props.form;
		const { dataList, loading } = this.state;
		let tempCurrencyCode = '';
		let finalCurrencySymbol = '';
		let isApproved = false;
		let allApproved = false;
		let totalListRevenue = 0;
		dataList.map(item => {
			totalListRevenue += item.revenue;
			if (item.currency) {
				tempCurrencyCode = item.currency;
			}
			if (item.status == 'Approved') {
				isApproved = true;
				allApproved = true;
			} else {
				allApproved = false;
			}
		});
		if (tempCurrencyCode && isApproved) {
			finalCurrencySymbol = `,${tempCurrencyCode}`;
		}
		const columns = [
			{
				title: 'Campaign',
				dataIndex: 'campaign',
				width: '30%',
			},
			{
				title: 'Conversion',
				dataIndex: 'conversion',
				render: text => {
					return numeral(text).format('0,0');
				},
			},
			{
				title: 'Total Amount,$',
				dataIndex: 'total_amt',
				render: (text, record) => {
					if (record.status == 'Approved') {
						return text != null && text != undefined
							? `${numeral(text).format('0,0.00')}`
							: '';
					} else {
						return '--';
					}
				},
			},
			{
				title: 'Deducted Amount,$',
				dataIndex: 'deducted_amt',
				render: (text, record) => {
					if (record.status == 'Approved') {
						return text != null && text != undefined
							? `${numeral(text).format('0,0.00')}`
							: '';
					} else {
						return '--';
					}
				},
			},
			// {
			//     title: 'Deducted Reference',
			//     dataIndex: 'file',
			//     render:(text)=>{
			//         if(text && text.length){
			//             return  this.showAttachment(text)
			//         }else{
			//             return ''
			//         }
			//     }
			// },{
			//     title: 'Confirmed Amount',
			//     dataIndex: 'confirm_amt',
			//     render:(text)=>{
			//         return text!=null && text!=undefined?`$${numeral(text).format('0,0.00')}`:''
			//     }
			// },
			{
				title: 'Revenue' + finalCurrencySymbol,
				dataIndex: 'revenue',
				render: (text, record) => {
					if (record.status == 'Approved') {
						return text != null && text != undefined
							? `${numeral(text).format('0,0.00')}`
							: '';
					} else {
						return '--';
					}
				},
			},
			// {
			//     title: 'Currency',
			//     dataIndex: 'currency',
			//     render:(text,record)=>{
			//         if(record.status == 'Approved'){
			//             return text;
			//         }else{
			//             return '--'
			//         }
			//     }
			// },
			{
				title: 'Status',
				dataIndex: 'status',
				render: text => {
					if (text == 'Pending') {
						return (
							<Popover
								content={'Waiting for the confirmation by advertiser'}
								trigger="hover"
							>
								<Tag color="#f0ad4e">Pending</Tag>
							</Popover>
						);
					} else if (text == 'Approved') {
						return (
							<Popover
								content={'Statement has been approved by advertiser'}
								trigger="hover"
							>
								<Tag color="#108ee9">Approved</Tag>
							</Popover>
						);
					}
				},
			},
			// {
			//     title: 'Month',
			//     dataIndex: 'month',
			//     render:(text)=>{
			//         return <span style={{whiteSpace:'nowrap'}}>{text}</span>
			//     }
			// },{
			//     title: 'Payout',
			//     width:'70px',
			//     dataIndex: 'payout'
			// },{
			//     title: 'Revenue',
			//     dataIndex: 'revenue'
			// },{
			//     title: 'File',
			//     dataIndex: 'file',
			//     render:(text)=>{
			//         return text && text.length?(
			//             text.map((item,index)=>{
			//                 return <a href={item} key={index} target='_blank'>{item}</a>
			//             })
			//         ):null
			//     }
			// },
		];
		return (
			<div>
				<img src={imgUrl} alt="" style={{ display: 'none' }} />
				<PageHeaderLayout />
				<Card bordered={false} style={{ marginTop: 30 }}>
					<div className={styles.searchForm}>
						<Form onSubmit={this.queryList} layout="inline">
							<Row gutter={{ md: 8, lg: 24, xl: 48 }} style={{ marginRight: '0px' }}>
								<Col md={12} sm={24}>
									<FormItem label="Month">
										<MonthPicker
											allowClear={false}
											onChange={this.dateChange}
											style={{ width: '230px' }}
											placeholder="Select month"
											value={
												this.state.month ? moment(this.state.month) : null
											}
										/>
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
					<div className={styles.billingTableWrapper}>
						<Table
							rowKey="uniqueKey"
							columns={columns}
							dataSource={dataList}
							bordered
							loading={loading}
							size="small"
							pagination={false}
							title={
								allApproved
									? () => {
											return (
												<div style={{ color: '#333' }}>
													Total Revenue：{`$${numeral(
														totalListRevenue
													).format('0,0.00')}`}
												</div>
											);
									  }
									: null
							}
							footer={() => {
								return (
									<div>
										<p>
											Once all Status are approved. Please raise an invoice
											and send it to your account manager and mark
											finance@moca-tech.net.
										</p>
										<p>
											If there is any discrepancy or deduction report is
											requested, please contact your account manager or email
											to publisher@moca-tech.net.
										</p>
										<p>
											Payment date is on N + billing term since we receive
											your invoice.
										</p>
										<p>
											The payment will be made when minimum payment threshold
											is reached.
										</p>
										<Link to="/document/deductionType">Log Deduction Type</Link>
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
