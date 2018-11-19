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
    Radio
} from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { getDate, getTheFirstDay, deepCloneObj } from '../../utils/commonFunc';
import {getTimeDistance} from '../../utils/utils';
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
const CheckboxGroup = Checkbox.Group;

const checkBoxOptions = [
    { label: 'Today', value: '1' },
    { label: 'Yestoday', value: '2' },
    { label: 'OneWeek', value: '3' },
    { label: 'OneMonth', value: '4' },
    { label: 'Custom', value: '5' },
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
            checkedOptions:['1','2','3'],
            defaultRadioOpt:1,
            start_date: getTimeDistance('month')[0].format('YYYY-MM-DD'),
            end_date: getTimeDistance('month')[1].format('YYYY-MM-DD'),
            rangePickerShow:false,
            popoverVisible:false
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

    /**
     * @param type:要展示的为哪种类型
     * @param showLines:要展示的是那几个时间段的数据
     */
	fetchList = (type,showLines) => {
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
    
    changeCheckOpts = (checkedValues) => {
        this.setState({
            checkedOptions:checkedValues
        },function(){
            if(this.state.checkedOptions.indexOf('5') > -1){
                this.setState({
                    rangePickerShow:true
                })
            }else{
                this.setState({
                    rangePickerShow:false
                })
            }
        })
    }

    selectDefaultRadioOpt = (e) => {
        this.setState({
            defaultRadioOpt:e.target.value
        })
    }

    dateRangeChange = (date, dateString) => {
        this.setState({
            start_date: dateString[0], 
            end_date: dateString[1]
        })
    }

    sureChooseTheseOpts = () => {
        console.log(this.state.defaultRadioOpt);//依照哪个时间维度来排序
        console.log(this.state.checkedOptions);//选择了需要展示的时间维度
        this.setState({
            popoverVisible:false
        },function(){
            if(this.state.checkedOptions.length == 2){
                this.fetchList(1,1)
            }else if(this.state.checkedOptions.length == 1){
                this.fetchList(1,2);
            }else{
                this.fetchList(1)
            }
        })
    }

    popoverVisibleChange = (visible) => {
        this.setState({
            popoverVisible:visible 
        });
    }

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
                fixed: 'left',
                width: 520,
				render: (value, row, index) => {
					let labelFilter;
					const subText = (
						<div className={styles.pannelHeader}>
                            <div className={styles.pannelOperate}
                                style={row.typeArr && row.typeArr.length == 3 ? {marginLeft:22}:(
                                    row.typeArr && row.typeArr.length == 2? {marginLeft:22*2}:(
                                        row.typeArr && row.typeArr.length == 1?{marginLeft:22*3}:{marginLeft:80} )
                                )}>
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
                                    : <a style={{visibility:'hidden'}}>1</a>}
                            </div>
                            <div  className={styles.headImgAllWrapper}>
                                <img style={row[0].length && row[0].length>1?{width:30,height:30}:{width:15,height:15}} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg"/>
                                <div className={row[0].length && row[0].length>1?styles.headTitleWrapper:styles.headTitleWrapperTwo}>   
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
							<span className={styles.imitateWrapper} style={{width:450}}>
								<Popover content={content} trigger="click">
									<Icon type="filter" style={{ cursor: 'pointer' }} />
								</Popover>
								<div style={{ display: 'inline-block' }}>{subText}</div>
							</span>
						);
					} else {
						return (
							<span className={styles.imitateWrapper}>
								<div style={{ display: 'inline-block' }}>{subText}</div>
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
				width: 100,
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
            {
				title: 'Conv',
				dataIndex: '2',
				width: 100,
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
				sorter: (a, b) => a[2][1] - b[2][1],
            },
            {
				title: 'Delivered',
				dataIndex: '3',
				width: 100,
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
				sorter: (a, b) => a[3][1] - b[3][1],
            },
            {
				title: 'Fraud',
				dataIndex: '4',
				width: 100,
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
				sorter: (a, b) => a[4][1] - b[4][1],
            },
            {
				title: 'Kpi',
				dataIndex: '5',
				width: 100,
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
				sorter: (a, b) => a[5][1] - b[5][1],
            },
            {
				title: 'Clicks',
				dataIndex: '6',
				width: 100,
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
				sorter: (a, b) => a[6][1] - b[6][1],
            },
            {
				title: 'OutFlow',
				dataIndex: '7',
				width: 100,
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
				sorter: (a, b) => a[7][1] - b[7][1],
            },
            {
                title: 'Operate',
				dataIndex: '',
                width: 100,
                fixed: 'right',
				render: (text, record) => {
                    return <a>Operate</a>
                }
            }
        ];

        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px',
        };
        
        const timeRangContent = (
            <div style={{width:280,overflow:'hidden'}} className={styles.optionsWrapper}>
                <div style={{width:120,float:'left'}}>
                    <CheckboxGroup options={checkBoxOptions} value={this.state.checkedOptions} onChange={this.changeCheckOpts} />
                </div>
                <div style={{width:30,float:'left'}}>
                    <RadioGroup onChange={this.selectDefaultRadioOpt} value={this.state.defaultRadioOpt}>
                        <Radio style={radioStyle} value={1}></Radio>
                        <Radio style={radioStyle} value={2}></Radio>
                        <Radio style={radioStyle} value={3}></Radio>
                        <Radio style={radioStyle} value={4}></Radio>
                        <Radio style={radioStyle} value={5}></Radio>
                    </RadioGroup>
                </div>
                {
                    this.state.rangePickerShow?(
                        <RangePicker
                            allowClear={false}
                            onChange={this.dateRangeChange}
                            value={
                                [
                                    moment(
                                        this.state.start_date
                                    ),
                                    moment(
                                        this.state.end_date
                                    ),
                                ]
                            }
                        />
                    ):null
                }
                <div style={{width:280,borderTop:'1px solid #e6e6e6',float:'left',textAlign:'right'}}>
                    <Button style={{marginTop:10}} onClick={this.sureChooseTheseOpts}>Sure</Button>
                </div>
            </div>
        );

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
                            </Row>
                        </Form>
						<Table
                            scroll={{ x: 1500, y: 400 }}
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
