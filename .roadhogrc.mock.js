import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList, getNewCampaignList } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
import { format, delay } from 'roadhog-api-doc';
//引入conversions的mock数据
import {
	homepageChartData,
	recent30d,
	queryByDateRange,
	lastestCampaigns,
	latestUpdates,
} from './mock/homepage';
import { myCampaigns, filterCampaigns, campaignDetails } from './mock/myCampaign';
import { reportList } from './mock/report';
import {
    filterPannels,
    filterPannelsType1,
    filterPannelsType2,
	filterFirstPannel,
	filterSecondPannel,
	filterThirdPannel,
} from './mock/pannel';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
	// 支持值为 Object 和 Array
	'GET /api/currentUser': {
		$desc: '获取当前用户接口',
		$params: {
			pageSize: {
				desc: '分页',
				exp: 2,
			},
		},
		$body: {
			name: 'Serati Ma',
			avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
			userid: '00000001',
			notifyCount: 12,
		},
	},
	// GET POST 可省略
	'GET /api/users': [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park',
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park',
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sidney No. 1 Lake Park',
		},
	],
	'GET /api/project/notice': getNotice,
	'GET /api/activities': getActivities,
	'GET /api/rule': getRule,
	'POST /api/rule': {
		$params: {
			pageSize: {
				desc: '分页',
				exp: 2,
			},
		},
		$body: postRule,
	},
	'POST /api/forms': (req, res) => {
		res.send({ message: 'Ok' });
	},
	'GET /api/tags': mockjs.mock({
		'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
	}),
	'GET /api/fake_list': getFakeList,
	//ranAdd 添加campaignList
	'GET /api/getNewCampaignList': getNewCampaignList,
	'GET /api/fake_chart_data': getFakeChartData,
	'GET /api/profile/basic': getProfileBasicData,
	'GET /api/profile/advanced': getProfileAdvancedData,
	'POST /api/login/account': (req, res) => {
		const { password, email, type } = req.body;
		if (password === '888888' && email === 'admin') {
			res.send({
				code: '0',
				type,
				currentAuthority: 'admin',
			});
			return;
		}
		if (password === '123456' && email === 'user') {
			res.send({
				code: '0',
				type,
				currentAuthority: 'user',
			});
			return;
		}
		res.send({
			code: '1',
			type,
			currentAuthority: 'guest',
		});
	},
	//连接后端用户登陆
	'POST /pub/user/login': (req, res) => {
		const { email, password } = req.body;
		if (password === '888888' && email === 'racky@moca.com') {
			res.send({
				rcode: 0,
				userinfo: {
					name: 'aaa',
					email: 'xxx@moca-tech.net',
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
				},
				currentAuthority: 'admin',
			});
			return;
		}
		if (password === '123456' && email === 'unknown@moca.com') {
			res.send({
				rcode: 0,
				userinfo: {
					name: 'bbb',
					email: 'xxx@moca-tech.net',
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
				},
				currentAuthority: 'user',
			});
			return;
		}
		res.send({
			status: 'error',
			currentAuthority: 'guest',
		});
	},
	//连接后端的修改密码接口
	'POST /pub/user/changePwd': (req, res) => {
		const { old_pwd, new_pwd } = req.body;
		if (old_pwd != new_pwd) {
			res.send({
				rcode: 0,
				userinfo: {
					name: 'aaa',
					email: 'xxx@moca-tech.net',
					avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
				},
				currentAuthority: 'admin',
			});
			return;
		}
		res.send({
			status: 'error',
		});
	},
	'POST /api/register': (req, res) => {
		res.send({ status: 'ok', currentAuthority: 'user' });
	},
	'GET /api/notices': getNotices,
	'GET /api/500': (req, res) => {
		res.status(500).send({
			timestamp: 1513932555104,
			status: 500,
			error: 'error',
			message: 'error',
			path: '/base/category/list',
		});
	},
	'GET /api/404': (req, res) => {
		res.status(404).send({
			timestamp: 1513932643431,
			status: 404,
			error: 'Not Found',
			message: 'No message available',
			path: '/base/category/list/2121212',
		});
	},
	'GET /api/403': (req, res) => {
		res.status(403).send({
			timestamp: 1513932555104,
			status: 403,
			error: 'Unauthorized',
			message: 'Unauthorized',
			path: '/base/category/list',
		});
	},
	'GET /api/401': (req, res) => {
		res.status(401).send({
			timestamp: 1513932555104,
			status: 401,
			error: 'Unauthorized',
			message: 'Unauthorized',
			path: '/base/category/list',
		});
	},
	'GET /api/conversionAndClicksData': homepageChartData,
	'GET /pub/dash/recent30d': recent30d,
	'GET /pub/dash/queryByDateRange': queryByDateRange,
	'GET /pub/dash/latestCampaigns': lastestCampaigns,
	'GET /pub/dash/latestUpdates': latestUpdates,
	'GET /pub/dash/myCampaigns': myCampaigns,
	'GET /pub/campaigns': filterCampaigns,
	'GET /pub/campaigns/detail': campaignDetails,
	'GET /pub/report': reportList,
	'GET /pannel/list': filterPannels,
	'GET /pannel/list1': filterPannelsType1,
    'GET /pannel/list2':filterPannelsType2, 
    //  mockjs.mock({
    //     'code':0,
    //     'campaigns|4': [{
    //         startDate:'2018/11/01',
    //         endDate:'2018/11/31',
    //         'id|+1':1001, 
    //         name: 'Facebook-API-P121',
    //         0: ['today', 'ysetoday', 'OneWeek'],
    //         1: [10, 20, 30],
    //         2:[70,80,200],
    //         3:[70,80,200],
    //         4:[70,80,200],
    //         5:[70,80,200],
    //         6:[70,80,200],
    //         7:[70,80,200],
    //     }],
    // }),
	'GET /pannel/listOne': filterFirstPannel,
	// 'GET /pannel/listOne1': filterFirstPannelType1,
	// 'GET /pannel/listOne2': filterFirstPannelType2,
	'GET /pannel/listTwo': filterSecondPannel,
	// 'GET /pannel/listTwo1': filterSecondPannelType1,
	// 'GET /pannel/listTwo2': filterSecondPannelType2,
	'GET /pannel/listThree': filterThirdPannel,
	// 'GET /pannel/listThree1': filterThirdPannelType1,
	// 'GET /pannel/listThree2': filterThirdPannelType2,

	//   'GET /api/testMock':mockjs.mock({'data|100':['id|+1':1,]})
};

export default (noProxy ? {} : delay(proxy, 1000));
