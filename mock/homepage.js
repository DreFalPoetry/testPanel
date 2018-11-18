import moment from 'moment';

// mock data
const beginDay = new Date().getTime();

//小图表最近30天的点击数
const thirtyDaysClickData = [];
const fakeY = [1232, 4121, 1232, 8934, 3122, 2322, 4542, 2311, 2112, 1234, 7542, 2311, 2323, 3112, 9656, 2342, 1234];
for (let i = 0; i < fakeY.length; i += 1) {
    thirtyDaysClickData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: fakeY[i],
  });
}

//小图表最近30天的conversions
const thirtyDaysConversionsData = [];
const fakeYl = [123, 411, 232, 934, 122, 322, 542, 311, 112, 234, 542, 311, 323, 112, 656, 342, 234];
for (let i = 0; i < fakeY.length; i += 1) {
    thirtyDaysConversionsData.push({
        x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
        y: fakeYl[i],
  });
}


//趋势图Conversation走向数据信息
const conversionsData = [];
const conversionsClick = [112, 1313, 331, 1112, 1432, 1343, 1424, 152, 1553, 1455, 1978, 2344, 6343, 123, 6343, 123, 1444];
for (let i = 0; i < conversionsClick.length; i += 1) {
    conversionsData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: conversionsClick[i],
  });
}
//趋势图Click走向数据信息
const clicksData = [];
const clicksCount = [1231, 223, 3231, 1333, 1123, 312, 1313, 645, 4646, 345, 4546, 7676, 333, 3434, 1232, 5353, 765];
for (let i = 0; i < clicksCount.length; i += 1) {
    clicksData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: clicksCount[i],
  });
}

//提示信息--头部的个人提示信息
const announcement = {"info":"交互专家|蚂蚁金服-技术部-UED","userName":"李艺彤"};

//4个趋势图中的数据--30天的信息
const thirtyDaysInfo = {
    "Revenue":{"count":"12123.00","increase":"20%","dailyAvg":"412.13"},
    "clicks":{"count":"12334222","dailyAvg":"34112","data":conversionsData},
    "conversions":{"count":"100233","dailyAvg":"2313","data":thirtyDaysConversionsData},
    "Campaigns":{"inProgress":17,"dailyCap":"4239","todayDeliveried":"23%"}
};

//点击量和Campaign排行信息
const topCampaigns = [];
for (let i = 0; i < 7; i += 1) {
    topCampaigns.push({
        title: `联航路 ${i+1} 号店`,
        total: 323234,
    });
}
const topClicks = [];
for (let i = 0; i < 7; i += 1) {
    topClicks.push({
        title: `浦申南路 ${i+1} 号店`,
        total: 2344241,
    });
}

const brandLogos = [
    'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
    'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
    'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
    'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
    'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
    'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
    'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
    'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];
//历史7天的更新记录
const sevenDaysUpdateList = [];
for(let i=0;i<7;i++){
    sevenDaysUpdateList.push({
        logo:brandLogos[i%10],
        info: Math.ceil(Math.random()*100000)+"  Amazon Shopping  Update daily cap from 100 to 150",
        time: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD')
    });
}

export const homepageChartData = {
    conversionsData,
    clicksData,
    topCampaigns,
    topClicks,
    announcement,
    thirtyDaysInfo,
    sevenDaysUpdateList
};

//1
export const recent30d = {
    "code":"0",
    "sum":{
		"rev":{"total":1000, "incr":10},
		"clk":{"total":1000, "each":[10,20,31,12,41,10,20,31,12,41,10,20,31,12,41,10,20,31,12,41,10,20,31,12,41,10,20,31,12,41]},
		"conv":{"total":1000, "each":[10,20,32,44,24,10,20,32,44,24,10,20,32,44,24,10,20,32,44,24,10,20,32,44,24,10,20,32,44,24]}
	},
	"camp":{
		"total":17,
		"caps":2000,
		"deliveried":23
	}
};

//2
export const queryByDateRange = {
    "code":0,
	"clk":{
		"each":[10,20,30,40,59,10,20,30,40,59,10,20,30,40,59,10,20,30,40,59,10,20,30,40,59,10,20,30,40,59,],
		"top10":[{
			"name":"NAME1",
			"cnt":9000
			},{
			"name":"NAME2",
			"cnt":8000
			},{
			"name":"NAME3",
			"cnt":7000
			},{
            "name":"NAME4",
            "cnt":8000
            },{
            "name":"NAME5",
            "cnt":8000
            },{
            "name":"NAME6",
            "cnt":8000
            },{
            "name":"NAME7",
            "cnt":8000
            },{
            "name":"NAME8",
            "cnt":8000
        }]
	},
	"conv":{
		"each":[10,20,30,20,40,10,20,30,20,40,10,20,30,20,40,10,20,30,20,40,10,20,30,20,40,10,20,30,20,40,],
		"top10":[{
			"name":"NAME1",
			"cnt":9000
			},{
			"name":"NAME2",
			"cnt":8000
			},{
			"name":"NAME3",
			"cnt":7000
			},{
            "name":"NAME4",
            "cnt":8000
            },{
            "name":"NAME5",
            "cnt":8000
            },{
            "name":"NAME6",
            "cnt":8000
            },{
            "name":"NAME7",
            "cnt":8000
            },{
            "name":"NAME8",
            "cnt":8000
        }]
	}
}

//3
export const lastestCampaigns = {
    "code":0,
	"camps":[{
		"name":"demo1",
        "id":1000,
		"icon":"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
		"category":"Shopping",
		"kpi":"soft",
		"payfor":"CPI",
		"payout":0.3,
		"currency":"USD",
		"created_at":""
	},{
		"name":"demo2",
		"icon":"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
		"category":"Shopping",
		"kpi":"soft",
		"payfor":"CPI",
		"payout":0.3,
		"currency":"USD",
		"created_at":""
	}]
}

//4
export const latestUpdates = {
    "code":0,
	"updates":[{
        "name":"demo1",
        "icon":"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        "id":1000,
		"type":1,// 1,update cap;2,update payout;3,update creative;4,terminate
		"old":"399",
		"new":"500",
		"time":"2018-02-01 07:00:22"
	},{
        "name":"demo2",
        "icon":"https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png",
        "id":1000, 
		"type":3,// 1,update cap;2,update payout;3,update creative;4,terminate
		"old":"399",
		"new":"500",
		"time":"2018-02-01 07:00:22"
	}]
}

export default {
    homepageChartData,
    recent30d,
    queryByDateRange,
    lastestCampaigns,
    latestUpdates
};
