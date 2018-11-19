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
import { getDate, getTheFirstDay, deepCloneObj } from '../../utils/commonFunc';
import styles from '../../css/common.less';
import { getMonth } from 'date-fns';
import {
	queryPannel,
	filterFirstPannel,
	filterSecondPannel,
	filterThirdPannel,
} from '../../services/api';
//ranAdd
const { Search } = Input;
const { Option } = Select;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const FormItem = Form.Item;

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
		};
	}

	componentDidMount() {
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
					},
					function() {
						this.fetchList(typeLine.type);
					}
				);
			} else {
				let tempRow = deepCloneObj(row);
				let tempTypeArr = tempRow.typeArr;
				tempTypeArr.filter(item => {
					item.selected = false;
					if (item.type == typeLine.type) {
						item.selected = true;
					}
				});
				tempRow.typeArr = tempTypeArr;
				if (row.typeArr.length == 3) {
					this.fetchFirstList(typeLine.type, tempRow);
				} else if (row.typeArr.length == 2) {
					this.fetchSecondlist(typeLine.type, tempRow);
				} else if (row.typeArr.length == 1) {
					this.fetchThirdlist(typeLine.type, tempRow);
				}
			}
		}
	};

	fetchList = type => {
		const response = queryPannel();
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
					item.uniqueKey = index + 1;
				});
				this.setState({
					dataList: tempDataList,
				});
			}
		});
	};

	//表格第一级点击出现第二级
	fetchFirstList = (type, row) => {
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
					item.uniqueKey = 'first' + index;
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
				});
			}
		});
	};

	//表格第二级点击出现第三级
	fetchSecondlist = (type, row) => {
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
					item.uniqueKey = 'second' + index;
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
				});
			}
		});
	};

	//表格第三级点击出现第四级
	fetchThirdlist = (type, row) => {
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
					item.uniqueKey = 'third' + index;
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
				});
			}
		});
	};

	clickToAsc = record => {
		let tempRecord = deepCloneObj(record);
		let tempChild = tempRecord.children.sort(this.sortCompare(1, 1, 1));
		this.asyncDataList(tempRecord, tempChild);
	};

	clickToDesc = record => {
		let tempRecord = deepCloneObj(record);
		let tempChild = tempRecord.children.sort(this.sortCompare(1, 1, 2));
		this.asyncDataList(tempRecord, tempChild);
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
	};

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
		console.log(record);
		console.log(filterType);
		console.log(value);
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
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const { dataList, loading, headerTypeChoose } = this.state;
		const columns = [
			{
				title: () => {
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
						</span>
					);
				},
				dataIndex: 'id',
				render: (value, row, index) => {
					let labelFilter;
					const subText = (
						<span className={styles.pannelHeader}>
							{row.typeArr && row.typeArr.length
								? row.typeArr.map((item, ind) => {
										if (item.selected) {
											labelFilter = item;
										}
										return (
											<a
												key={row.id + ind}
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
								: null}
							{value}
						</span>
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
							<span className={styles.imitateWrapper}>
								<Popover content={content} trigger="click">
									<Icon type="filter" style={{ cursor: 'pointer' }} />
								</Popover>
								<p style={{ display: 'inline-block' }}>{subText}</p>
							</span>
						);
					} else {
						return (
							<span className={styles.imitateWrapper}>
								<p style={{ display: 'inline-block' }}>{subText}</p>
							</span>
						);
					}
				},
			},
			{
				title: 'Date',
				dataIndex: '0',
				width: '12%',
				render: (text, record) => {
					if (text) {
						return (
							<span className={styles.imitateWrapper}>
								{text.map((item, index) => {
									return <p key={item + index}>{item}</p>;
								})}
							</span>
						);
					} else {
						return '';
					}
				},
			},
			{
				title: 'Count',
				dataIndex: '1',
				width: '30%',
				render: (text, record) => {
					if (record.children) {
						return (
							<span className={styles.imitateWrapper}>
								{text.map((item, index) => {
									if (index == 1) {
										return (
											<p className={styles.sortStyle} key={item + index}>
												{item}
												<a onClick={this.clickToAsc.bind(this, record)}>
													asc
												</a>
												<a onClick={this.clickToDesc.bind(this, record)}>
													desc
												</a>
											</p>
										);
									} else {
										return <p key={item + index}>{item}</p>;
									}
								})}
							</span>
						);
					} else {
						return (
							<span className={styles.imitateWrapper}>
								{text.map((item, index) => {
									return <p key={item + index}>{item}</p>;
								})}
							</span>
						);
					}
				},
				sorter: (a, b) => a[1][1] - b[1][1],
			},
		];
		return (
			<div>
				<PageHeaderLayout />
				<Card bordered={false} style={{ marginTop: 30 }}>
					<div className={styles.pannelTableWrapper}>
						<Table
							rowKey="uniqueKey"
							columns={columns}
							dataSource={dataList}
							bordered
							loading={loading}
							size="small"
							pagination={false}
						/>
					</div>
				</Card>
			</div>
		);
	}
}
