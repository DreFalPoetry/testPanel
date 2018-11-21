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
import { Resizable } from 'react-resizable';

const ResizeableTitle = (props) => {
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
    {label:'Count',value:'1'},
    {label:'Conv',value:'2'},
    {label:'Delivered',value:'3'},
    {label:'Fraud',value:'4'},
    {label:'Kpi',value:'5'},
    {label:'Clicks',value:'6'},
    {label:'OutFlow',value:'7'},
]

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
            popoverVisible:false,
            allCheckTableColsToShow:['1','2','3','4','5','6','7'],
            columnPopoverVisible:false,
            columns:[
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
                    width: 100,
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('1') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('2') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('3') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('4') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('5') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('6') ? styles.hidden : '',
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
                    isDynamic:true
                    // className: !this.judgeIsInCheckbox('7') ? styles.hidden : '',
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
            ],
		};
	}

	componentDidMount() {
        this.fetchList(1);
        const tempColumns = this.state.columns.map((col, index)=>{
            let tempCol = {...col};
           if(col.isDynamic && this.state.allCheckTableColsToShow.indexOf(col.dataIndex) == -1){
               tempCol.className = styles.hidden;   
           }
           return tempCol;
        })
        this.setState({
            columns:tempColumns
        })
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
    

    changeCheckOpts = (type,checkedValues) => {
        if(type == 1){
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
        }else if(type == 2){
            const tempColumns = this.state.columns.map((col, index)=>{
                let tempCol = {...col};
               if(col.isDynamic && checkedValues.indexOf(col.dataIndex) == -1){
                   tempCol.className = styles.hidden;   
               }else{
                   tempCol.className = ''
               }
               return tempCol;
            })
            this.setState({
                columns:tempColumns,
                allCheckTableColsToShow:checkedValues
            })
        }
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

    columnPopoverVisibleChange = (visible) => {
        this.setState({
            columnPopoverVisible:visible
        })
    }

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

        const scrollX = this.state.columns.reduce((total,item)=>{
            let width = 0;
            if(!item.className){
                width = item.width;
            }
            return total+width;
        },0)
        
        const timeRangContent = (
            <div style={{width:280,overflow:'hidden'}} className={styles.optionsWrapper}>
                <div style={{width:120,float:'left'}}>
                    <CheckboxGroup options={checkBoxOptions} value={this.state.checkedOptions} onChange={this.changeCheckOpts.bind(this,1)} />
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

        const showColumnsContent = (
            <div style={{width:300}}>
                <CheckboxGroup options={columnsOptions} value={this.state.allCheckTableColsToShow} onChange={this.changeCheckOpts.bind(this,2)} />
            </div>
        )

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
                            scroll={{ x: scrollX, y: 400 }}
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
