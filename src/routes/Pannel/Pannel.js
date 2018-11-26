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
	Checkbox,
	Radio,
} from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getDate, getTheFirstDay, deepCloneObj } from '../../utils/commonFunc';
import { getTimeDistance } from '../../utils/utils';
import styles from '../../css/common.less';
import { getMonth } from 'date-fns';
import {
	queryPannel,
	filterFirstPannel,
	filterSecondPannel,
	filterThirdPannel,
} from '../../services/api';
import { Resizable } from 'react-resizable';

const ResizeableTitle = props => {
	const { onResize, width, ...restProps } = props;

	if (!width) {
		return <th {...restProps} />;
	}

	return (
		<Resizable width={width} height={0} onResize={onResize}>
			<th {...restProps} />
		</Resizable>
	);
};

const { Search } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;

const checkBoxOptions = [
	{ label: 'Today', value: '1' },
	{ label: 'Yestoday', value: '2' },
	{ label: 'OneWeek', value: '3' },
	{ label: 'OneMonth', value: '4' },
	{ label: 'Custom', value: '5' },
];

const columnsOptions = [
	{ label: 'Count', value: '1' },
	{ label: 'Conv', value: '2' },
	{ label: 'Delivered', value: '3' },
	{ label: 'Fraud', value: '4' },
	{ label: 'Kpi', value: '5' },
	{ label: 'Clicks', value: '6' },
	{ label: 'OutFlow', value: '7' },
];

const RadioGroup = Radio.Group;

@Form.create()
export default class DeductionTypeDocPage extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			dataList: [],
			loading: true,
			headerTypeArr: [
				{ type: 1, label: 'C.', selected: true },
				{ type: 2, label: 'G.', selected: false },
				{ type: 3, label: 'P.', selected: false },
				{ type: 4, label: 'Sp.', selected: false },
			],
			checkedOptions: ['1', '2', '3'],
			defaultRadioOpt: 0,
			start_date: getTimeDistance('month')[0].format('YYYY-MM-DD'),
			end_date: getTimeDistance('month')[1].format('YYYY-MM-DD'),
			rangePickerShow: false,
			popoverVisible: false,
			allCheckTableColsToShow: ['1', '2', '3', '4', '5', '6', '7'],
			columnPopoverVisible: false,
			columns: [],
			tableLoading: false,
			currentSort: null,
			sortStateTree: {},
			leftFixedColWidth: 520,
			timeDimensionChanged: false,
			initalColumns: [
				{
					title: () => {
						let titleLabelFilter;
						this.state.headerTypeArr.map((item, index) => {
							if (item.selected) {
								titleLabelFilter = item;
							}
						});
						const content = (
							<div>
								<label>{titleLabelFilter.label}：</label>
								<Search
									placeholder="input search text"
									onSearch={this.filterList.bind(
										this,
										null,
										titleLabelFilter.type
									)}
									style={{ width: 120 }}
								/>
							</div>
						);
						return (
							<span className={styles.pannelHeader}>
								{this.state.headerTypeArr.map((item, index) => {
									return (
										<a
											key={'headerTypeArr' + index}
											onClick={this.clickType.bind(this, item, null)}
											className={
												item.selected ? null : styles.pannelHeaderDefault
											}
										>
											{item.label}
										</a>
									);
								})}
								<Popover content={content} trigger="click">
									<Icon type="filter" />
								</Popover>
							</span>
						);
					},
					dataIndex: 'id',
					fixed: 'left',
					width: 520,
					render: (value, row, index) => {
						let labelFilter;
						const subText = (
							<div className={styles.pannelHeader}>
								<div
									className={styles.pannelOperate}
									style={
										row.typeArr && row.typeArr.length == 3
											? { marginLeft: 22 }
											: row.typeArr && row.typeArr.length == 2
												? { marginLeft: 22 * 2 }
												: row.typeArr && row.typeArr.length == 1
													? { marginLeft: 22 * 3 }
													: { marginLeft: 80 }
									}
								>
									{row.typeArr && row.typeArr.length ? (
										row.typeArr.map((item, ind) => {
											if (item.selected) {
												labelFilter = item;
											}
											return (
												<a
													key={String(row.id) + ind}
													onClick={this.clickType.bind(this, item, row)}
													className={
														item.selected
															? null
															: styles.pannelHeaderDefault
													}
												>
													{item.label}
												</a>
											);
										})
									) : (
										<a style={{ visibility: 'hidden' }}>1</a>
									)}
								</div>
								<div className={styles.headImgAllWrapper}>
									<img
										style={
											row[0].length && row[0].length > 1
												? { width: 30, height: 30 }
												: { width: 15, height: 15 }
										}
										src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"
									/>
									<div
										style={{ width: this.state.leftFixedColWidth - 140 }}
										className={
											row[0].length && row[0].length > 1
												? styles.headTitleWrapper
												: styles.headTitleWrapperTwo
										}
									>
										<span>{`${value}-${row.name}`}</span>
										<span>{`${row.startDate}-${row.endDate}`}</span>
									</div>
								</div>
							</div>
						);
						if (row.children) {
							const content = (
								<div>
									<label>{labelFilter.label}：</label>
									<Search
										placeholder="input search text"
										onSearch={this.filterList.bind(this, row, labelFilter.type)}
										style={{ width: 120 }}
									/>
								</div>
							);
							return (
								<div>
									<span className={styles.imitateWrapper}>
										<div>{subText}</div>
										<Popover content={content} trigger="click">
											<Icon
												type="filter"
												style={{ cursor: 'pointer' }}
												className={styles.filterIconsDisplay}
											/>
										</Popover>
									</span>
								</div>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									<div>{subText}</div>
								</span>
							);
						}
					},
					isDefault: true,
				},
				{
					title: 'Date',
					dataIndex: '0',
					width: 120,
					render: (text, record) => {
						if (text) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						} else {
							return '';
						}
					},
					isDefault: true,
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								1,
								null,
								this.state.currentSort == '1asc' ? '1desc' : '1asc',
								this.state.currentSort == '1asc' ? 2 : 1
							)}
						>
							Count
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,1, null,'1asc',1)}
									className={
										this.state.currentSort == '1asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,1, null,'1desc',2)}
									className={
										this.state.currentSort == '1desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '1',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											//为排序的时间维度的话添加排序标志
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														1,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][1] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,1, record,record.uniqueKey,1)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][1] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,1, record,record.uniqueKey,2)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][1] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								2,
								null,
								this.state.currentSort == '2asc' ? '2desc' : '2asc',
								this.state.currentSort == '2asc' ? 2 : 1
							)}
						>
							Conv
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,2, null,'2asc',1)}
									className={
										this.state.currentSort == '2asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,2, null,'2desc',2)}
									className={
										this.state.currentSort == '2desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '2',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														2,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][2] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,2, record,record.uniqueKey,1)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][2] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,2, record,record.uniqueKey,2)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][2] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								3,
								null,
								this.state.currentSort == '3asc' ? '3desc' : '3asc',
								this.state.currentSort == '3asc' ? 2 : 1
							)}
						>
							Delivered
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,3, null,'3asc',1)}
									className={
										this.state.currentSort == '3asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,3, null,'3desc',2)}
									className={
										this.state.currentSort == '3desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '3',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														3,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][3] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,3, record,record.uniqueKey,1)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][3] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,3, record,record.uniqueKey,2)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][3] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								4,
								null,
								this.state.currentSort == '4asc' ? '4desc' : '4asc',
								this.state.currentSort == '4asc' ? 2 : 1
							)}
						>
							Fraud
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,4, null,'4asc',1)}
									className={
										this.state.currentSort == '4asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,4, null,'4desc',2)}
									className={
										this.state.currentSort == '4desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '4',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														4,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][4] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,4, record,record.uniqueKey,1)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][4] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,4, record,record.uniqueKey,2)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][4] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								5,
								null,
								this.state.currentSort == '5asc' ? '5desc' : '5asc',
								this.state.currentSort == '5asc' ? 2 : 1
							)}
						>
							Kpi
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,5, null,'5asc',1)}
									className={
										this.state.currentSort == '5asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,5, null,'5desc',2)}
									className={
										this.state.currentSort == '5desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '5',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														5,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][5] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															onClick={this.clickToSort.bind(
																this,
																5,
																record,
																record.uniqueKey,
																1
															)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][5] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															onClick={this.clickToSort.bind(
																this,
																5,
																record,
																record.uniqueKey,
																2
															)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][5] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								6,
								null,
								this.state.currentSort == '6asc' ? '6desc' : '6asc',
								this.state.currentSort == '6asc' ? 2 : 1
							)}
						>
							Clicks
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,6, null,'6asc',1)}
									className={
										this.state.currentSort == '6asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,6, null,'6desc',2)}
									className={
										this.state.currentSort == '6desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '6',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														6,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][6] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,6, record,record.uniqueKey,1)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][6] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															// onClick={this.clickToSort.bind(this,6, record,record.uniqueKey,2)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][6] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: () => (
						<span
							style={{ display: 'block' }}
							onClick={this.clickToSort.bind(
								this,
								7,
								null,
								this.state.currentSort == '7asc' ? '7desc' : '7asc',
								this.state.currentSort == '7asc' ? 2 : 1
							)}
						>
							OutFlow
							<span className={styles.sortRadiosDisplay}>
								<Icon
									type="caret-up"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,7, null,'7asc',1)}
									className={
										this.state.currentSort == '7asc' ? styles.currentSort : null
									}
								/>
								<Icon
									type="caret-down"
									style={{ cursor: 'pointer' }}
									// onClick={this.clickToSort.bind(this,7, null,'7desc',2)}
									className={
										this.state.currentSort == '7desc'
											? styles.currentSort
											: null
									}
								/>
							</span>
						</span>
					),
					dataIndex: '7',
					width: 120,
					render: (text, record) => {
						if (record.children) {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										if (index == this.state.defaultRadioOpt) {
											return (
												<p
													className={styles.sortStyle}
													key={String(record.id) + item + index}
													onClick={this.clickToSort.bind(
														this,
														7,
														record,
														record.uniqueKey,
														this.state.sortStateTree[
															record.uniqueKey
														] &&
														this.state.sortStateTree[
															record.uniqueKey
														][7] == 1
															? 2
															: 1
													)}
												>
													{item}
													<span className={styles.sortRadiosDisplay}>
														<Icon
															type="caret-up"
															style={{ cursor: 'pointer' }}
															onClick={this.clickToSort.bind(
																this,
																7,
																record,
																record.uniqueKey,
																2
															)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][7] == 1
																	? styles.currentSort
																	: null
															}
														/>
														<Icon
															type="caret-down"
															style={{ cursor: 'pointer' }}
															onClick={this.clickToSort.bind(
																this,
																7,
																record,
																record.uniqueKey,
																2
															)}
															className={
																this.state.sortStateTree[
																	record.uniqueKey
																] &&
																this.state.sortStateTree[
																	record.uniqueKey
																][7] == 2
																	? styles.currentSort
																	: null
															}
														/>
													</span>
												</p>
											);
										} else {
											return (
												<p key={String(record.id) + item + index}>{item}</p>
											);
										}
									})}
								</span>
							);
						} else {
							return (
								<span className={styles.imitateWrapper}>
									{text.map((item, index) => {
										return <p key={String(record.id) + item + index}>{item}</p>;
									})}
								</span>
							);
						}
					},
				},
				{
					title: 'Operate',
					dataIndex: '',
					width: 120,
					fixed: 'right',
					render: (text, record) => {
						return <a>Operate</a>;
					},
					isDefault: true,
				},
			],
		};
	}

	componentDidMount() {
		const tempInitalColumns = [...this.state.initalColumns];
		const tempColumns = tempInitalColumns.filter((col, index) => {
			if (col.isDefault || this.state.allCheckTableColsToShow.indexOf(col.dataIndex) > -1) {
				return col;
			}
		});
		this.setState({
			columns: tempColumns,
		});
		this.fetchList(1);
	}

	componentWillUnmount() {}

	clickType = (typeLine, row) => {
		if (!typeLine.selected) {
			if (!row) {
				let tempheaderTypeArr = deepCloneObj(this.state.headerTypeArr);
				tempheaderTypeArr.filter(item => {
					item.selected = false;
					if (item.type == typeLine.type) {
						item.selected = true;
					}
				});
				this.setState(
					{
						headerTypeArr: tempheaderTypeArr,
						currentSort: null, //先去除所有的sort
						sortStateTree: {},
					},
					function() {
						this.fetchList(typeLine.type);
					}
				);
			} else {
				let tempRow = deepCloneObj(row);
				//去除掉这个row下边所有的sort
				let tempSortTree = { ...this.state.sortStateTree };
				for (let i in tempSortTree) {
					if (i.length >= tempRow.uniqueKey.length && i.indexOf(tempRow.uniqueKey) > -1) {
						delete tempSortTree[i];
					}
				}
				let tempTypeArr = tempRow.typeArr;
				tempTypeArr.filter(item => {
					item.selected = false;
					if (item.type == typeLine.type) {
						item.selected = true;
					}
				});
				tempRow.typeArr = tempTypeArr;
				if (row.typeArr.length == 3) {
					this.fetchFirstList(typeLine.type, tempRow, tempSortTree);
				} else if (row.typeArr.length == 2) {
					this.fetchSecondlist(typeLine.type, tempRow, tempSortTree);
				} else if (row.typeArr.length == 1) {
					this.fetchThirdlist(typeLine.type, tempRow, tempSortTree);
				}
			}
		}
	};

	/**
	 * @param type:要展示的为哪种类型
	 * @param showLines:要展示的是那几个时间段的数据
	 */
	fetchList = (type, showLines) => {
		const response = queryPannel(showLines);
		response.then(json => {
			this.setState({
				loading: false,
			});
			if (json.code == 0) {
				let tempArr = deepCloneObj(this.state.headerTypeArr);
				let tempDataList = json.campaigns;
				tempArr.filter((item, ind) => {
					item.selected = false;
					if (item.type == type) {
						tempArr.splice(ind, 1);
					}
				});
				tempDataList.filter((item, index) => {
					item.typeArr = tempArr;
					item.uniqueKey = String(index + 1);
				});
				this.setState({
					dataList: tempDataList,
				});
			}
		});
	};

	//表格第一级点击出现第二级
	fetchFirstList = (type, row, tempSortTree) => {
		const response = filterFirstPannel();
		response.then(json => {
			if (json.code == 0) {
				let tempArr = deepCloneObj(row.typeArr);
				let tempDataList = json.details;

				tempArr.filter((item, ind) => {
					item.selected = false;
					if (item.type == type) {
						tempArr.splice(ind, 1);
					}
				});

				tempDataList.filter((item, index) => {
					item.typeArr = tempArr;
					item.uniqueKey = row.uniqueKey + '-' + (index + 1);
				});

				let tempDataAll = deepCloneObj(this.state.dataList);
				tempDataAll.filter(item => {
					if (item.id == row.id) {
						item.children = tempDataList;
						item.typeArr = row.typeArr;
					}
				});
				this.setState({
					dataList: tempDataAll,
					sortStateTree: tempSortTree,
				});
			}
		});
	};

	//表格第二级点击出现第三级
	fetchSecondlist = (type, row, tempSortTree) => {
		const response = filterSecondPannel();
		response.then(json => {
			if (json.code == 0) {
				let tempArr = deepCloneObj(row.typeArr);
				let tempDataList = json.details;

				tempArr.filter((item, ind) => {
					item.selected = false;
					if (item.type == type) {
						tempArr.splice(ind, 1);
					}
				});

				tempDataList.filter((item, index) => {
					item.typeArr = tempArr;
					item.uniqueKey = row.uniqueKey + '-' + (index + 1);
				});

				let tempDataAll = deepCloneObj(this.state.dataList);
				tempDataAll.filter(item => {
					if (item.firstKey == row.firstKey) {
						item.children.filter(item2 => {
							if (item2.secondKey == row.secondKey) {
								item2.children = tempDataList;
								item2.typeArr = row.typeArr;
							}
						});
					}
				});
				this.setState({
					dataList: tempDataAll,
					sortStateTree: tempSortTree,
				});
			}
		});
	};

	//表格第三级点击出现第四级
	fetchThirdlist = (type, row, tempSortTree) => {
		const response = filterThirdPannel();
		response.then(json => {
			if (json.code == 0) {
				let tempArr = deepCloneObj(row.typeArr);
				let tempDataList = json.details;

				tempArr.filter((item, ind) => {
					item.selected = false;
					if (item.type == type) {
						tempArr.splice(ind, 1);
					}
				});

				tempDataList.filter((item, index) => {
					item.typeArr = tempArr;
					item.uniqueKey = row.uniqueKey + '-' + (index + 1);
				});

				let tempDataAll = deepCloneObj(this.state.dataList);
				tempDataAll.filter(item1 => {
					if (item1.firstKey == row.firstKey) {
						item1.children.filter(item2 => {
							if (item2.secondKey == row.secondKey) {
								item2.children.filter(item3 => {
									if (item3.thirdKey == row.thirdKey) {
										item3.children = tempDataList;
										item3.typeArr = row.typeArr;
									}
								});
							}
						});
					}
				});
				this.setState({
					dataList: tempDataAll,
					sortStateTree: tempSortTree,
				});
			}
		});
	};

	/**
	 * @param dataIndex:column的dataIndex
	 * @param record:该列的数据信息
	 * @param currentSort:每一列的排序标记
	 * @param sortType:升序或降序 升序 1，降序 2
	 */
	clickToSort = (dataIndex, record, currentSort, sortType) => {
		this.setState({
			loading: true,
		});
		let tempRecord;
		if (record) {
			//sort部分的逻辑
			let tempSortTree = { ...this.state.sortStateTree };
			if (tempSortTree[currentSort]) {
				tempSortTree[currentSort] = { [dataIndex]: sortType };
			} else {
				tempSortTree[currentSort] = { [dataIndex]: sortType };
			}
			this.setState({
				sortStateTree: tempSortTree,
			});
			//
			tempRecord = deepCloneObj(record);
			let tempChild = tempRecord.children.sort(
				this.sortCompare(dataIndex, this.state.defaultRadioOpt, sortType)
			);
			this.asyncDataList(tempRecord, tempChild);
		} else {
			tempRecord = deepCloneObj(this.state.dataList);
			tempRecord.sort(this.sortCompare(dataIndex, this.state.defaultRadioOpt, sortType));
			this.setState({
				dataList: tempRecord,
				currentSort: currentSort,
			});
			setTimeout(() => {
				this.setState({
					loading: false,
				});
			}, 0);
		}
	};

	asyncDataList = (tempRecord, tempChild, tempCompleteChild) => {
		let tempDataList = deepCloneObj(this.state.dataList);
		if (tempRecord.typeArr.length) {
			if (tempRecord.typeArr.length == 3) {
				tempDataList.filter(item => {
					if (item.firstKey == tempRecord.firstKey) {
						item.children = tempChild;
						if (tempCompleteChild) {
							item.tempCompleteChild = tempCompleteChild;
						} else {
							delete item.tempCompleteChild;
						}
					}
				});
			} else if (tempRecord.typeArr.length == 2) {
				tempDataList.filter(item1 => {
					if (item1.firstKey == tempRecord.firstKey) {
						item1.children.filter(item2 => {
							if (item2.secondKey == tempRecord.secondKey) {
								item2.children = tempChild;
								if (tempCompleteChild) {
									item2.tempCompleteChild = tempCompleteChild;
								} else {
									delete item2.tempCompleteChild;
								}
							}
						});
					}
				});
			} else if (tempRecord.typeArr.length == 1) {
				tempDataList.filter(item1 => {
					if (item1.firstKey == tempRecord.firstKey) {
						item1.children.filter(item2 => {
							if (item2.secondKey == tempRecord.secondKey) {
								item2.children.filter(item3 => {
									if (item3.thirdKey == tempRecord.thirdKey) {
										item3.children = tempChild;
										if (tempCompleteChild) {
											item3.tempCompleteChild = tempCompleteChild;
										} else {
											delete item3.tempCompleteChild;
										}
									}
								});
							}
						});
					}
				});
			}
		}
		this.setState({
			dataList: tempDataList,
		});
		setTimeout(() => {
			this.setState({
				loading: false,
			});
		}, 0);
	};

	/**
	 * @param property:哪一列进行排序,依据column的index
	 * @param index:时间维度的数组index
	 * @param type:升序或降序--升序1，降序2
	 */
	sortCompare = (property, index, type) => {
		return function(obj1, obj2) {
			var value1 = obj1[property][index];
			var value2 = obj2[property][index];
			if (type == 1) {
				// 升序
				return value1 - value2;
			} else {
				return value2 - value1;
			}
		};
	};

	filterList = (record, filterType, value) => {
		this.setState({
			loading: true,
		});
		if (record) {
			let tempRecord = deepCloneObj(record);
			let tempCompleteChild = tempRecord.tempCompleteChild
				? tempRecord.tempCompleteChild
				: tempRecord.children;
			let tempChild = [];
			if (value) {
				if (tempRecord.tempCompleteChild) {
					tempChild = tempRecord.tempCompleteChild.filter(item => {
						return String(item.id).indexOf(value) > -1;
					});
				} else {
					tempChild = tempRecord.children.filter(item => {
						return String(item.id).indexOf(value) > -1;
					});
				}
				this.asyncDataList(tempRecord, tempChild, tempCompleteChild);
			} else {
				this.asyncDataList(tempRecord, tempCompleteChild);
			}
		} else {
			let tempDataList;
			if (value) {
				if (!this.state.initalDataList) {
					tempDataList = [...this.state.dataList];
					this.setState({
						initalDataList: tempDataList,
					});
				} else {
					tempDataList = [...this.state.initalDataList];
				}
				let tempFilterArr = tempDataList.filter(item => {
					return String(item.id).indexOf(value) > -1;
				});
				this.setState({
					dataList: tempFilterArr,
				});
			} else {
				if (this.state.initalDataList) {
					this.setState(
						{
							dataList: this.state.initalDataList,
						},
						function() {
							delete this.state.initalDataList;
						}
					);
				}
			}
			setTimeout(() => {
				this.setState({
					loading: false,
				});
			}, 0);
		}
	};

	changeCheckOpts = (type, checkedValues) => {
		this.setState({
			timeDimensionChanged: true,
		});
		if (type == 1) {
			this.setState(
				{
					checkedOptions: checkedValues,
				},
				function() {
					if (this.state.checkedOptions.indexOf('5') > -1) {
						this.setState({
							rangePickerShow: true,
						});
					} else {
						this.setState({
							rangePickerShow: false,
						});
					}
				}
			);
		} else if (type == 2) {
			const tempInitalColumns = [...this.state.initalColumns];
			const tempColumns = tempInitalColumns.filter((col, index) => {
				if (col.isDefault || checkedValues.indexOf(col.dataIndex) > -1) {
					return col;
				}
			});
			const tempDataList = [...this.state.dataList];
			this.setState({
				columns: tempColumns,
				dataList: tempDataList,
				allCheckTableColsToShow: checkedValues,
			});
		}
	};

	selectDefaultRadioOpt = e => {
		this.setState({
			defaultRadioOpt: e.target.value,
		});
	};

	dateRangeChange = (date, dateString) => {
		this.setState({
			start_date: dateString[0],
			end_date: dateString[1],
		});
	};

	sureChooseTheseOpts = () => {
		console.log(this.state.defaultRadioOpt); //依照哪个时间维度来排序
		console.log(this.state.checkedOptions); //选择了需要展示的时间维度
		this.setState(
			{
				popoverVisible: false,
				currentSort: null,
				sortStateTree: {},
			},
			function() {
				if (this.state.timeDimensionChanged) {
					if (this.state.checkedOptions.length == 2) {
						this.fetchList(1, 1);
					} else if (this.state.checkedOptions.length == 1) {
						this.fetchList(1, 2);
					} else {
						this.fetchList(1);
					}
				}
			}
		);
	};

	popoverVisibleChange = visible => {
		this.setState({
			timeDimensionChanged: false,
			popoverVisible: visible,
		});
	};

	columnPopoverVisibleChange = visible => {
		this.setState({
			columnPopoverVisible: visible,
		});
	};

	judgeIsInCheckbox = value => {
		if (this.state['allCheckTableColsToShow'].indexOf(value) > -1) {
			return true;
		} else {
			return false;
		}
	};

	components = {
		header: {
			cell: ResizeableTitle,
		},
	};

	handleResize = index => (e, { size }) => {
		if (index == 0 && size.width >= 400) {
			this.setState({
				leftFixedColWidth: size.width,
			});
		}
		this.setState(({ columns }) => {
			const nextColumns = [...columns];
			nextColumns[index] = {
				...nextColumns[index],
				width: size.width,
			};
			return { columns: nextColumns };
		});
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { dataList, loading, headerTypeChoose } = this.state;
		const radioStyle = {
			display: 'block',
			height: '30px',
			lineHeight: '30px',
		};
		const scrollX = this.state.columns.reduce((total, item) => {
			let width = 0;
			if (!item.className) {
				width = item.width;
			}
			return total + width;
		}, 0);

		const timeRangContent = (
			<div style={{ width: 280, overflow: 'hidden' }} className={styles.optionsWrapper}>
				<div style={{ width: 120, float: 'left' }}>
					<CheckboxGroup
						options={checkBoxOptions}
						value={this.state.checkedOptions}
						onChange={this.changeCheckOpts.bind(this, 1)}
					/>
				</div>
				<div style={{ width: 30, float: 'left' }}>
					<RadioGroup
						onChange={this.selectDefaultRadioOpt}
						value={this.state.defaultRadioOpt}
					>
						<Radio style={radioStyle} value={0} />
						<Radio style={radioStyle} value={1} />
						<Radio style={radioStyle} value={2} />
						<Radio style={radioStyle} value={3} />
						<Radio style={radioStyle} value={4} />
					</RadioGroup>
				</div>
				{this.state.rangePickerShow ? (
					<RangePicker
						allowClear={false}
						onChange={this.dateRangeChange}
						value={[moment(this.state.start_date), moment(this.state.end_date)]}
					/>
				) : null}
				<div
					style={{
						width: 280,
						borderTop: '1px solid #e6e6e6',
						float: 'left',
						textAlign: 'right',
					}}
				>
					<Button style={{ marginTop: 10 }} onClick={this.sureChooseTheseOpts}>
						Sure
					</Button>
				</div>
			</div>
		);

		const showColumnsContent = (
			<div style={{ width: 300 }}>
				<CheckboxGroup
					options={columnsOptions}
					value={this.state.allCheckTableColsToShow}
					onChange={this.changeCheckOpts.bind(this, 2)}
				/>
			</div>
		);

		const columns = this.state.columns.map((col, index) => ({
			...col,
			onHeaderCell: column => ({
				width: column.width,
				onResize: this.handleResize(index),
			}),
		}));

		return (
			<div>
				<PageHeaderLayout />
				<Card bordered={false} style={{ marginTop: 30 }}>
					<div className={styles.pannelTableWrapper}>
						<Form layout="inline" onSubmit={this.submitSearch}>
							<Row>
								<Col sm={{ span: 12 }} xs={{ span: 24 }}>
									<FormItem label="Date">
										<Popover
											placement="bottom"
											content={timeRangContent}
											title="Select Time"
											trigger="click"
											visible={this.state.popoverVisible}
											onVisibleChange={this.popoverVisibleChange}
										>
											<Button type="primary">Click me</Button>
										</Popover>
									</FormItem>
								</Col>
								<Col sm={{ span: 12 }} xs={{ span: 24 }}>
									<FormItem label="Columns">
										<Popover
											placement="bottom"
											content={showColumnsContent}
											title="Select Show Columns"
											trigger="click"
											visible={this.state.columnPopoverVisible}
											onVisibleChange={this.columnPopoverVisibleChange}
										>
											<Button type="primary">Select</Button>
										</Popover>
									</FormItem>
								</Col>
							</Row>
						</Form>
						<Table
							scroll={{ x: scrollX, y: 500 }}
							rowKey="uniqueKey"
							columns={columns}
							dataSource={dataList}
							bordered
							loading={loading}
							size="small"
							components={this.components}
							pagination={false}
						/>
					</div>
				</Card>
			</div>
		);
	}
}
