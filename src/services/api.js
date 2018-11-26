import { stringify } from 'qs';
import request from '../utils/request';
import requestMock from '../utils/requestMock';

export async function queryProjectNotice() {
	return request('/api/project/notice');
}

export async function queryActivities() {
	return request('/api/activities');
}

export async function queryRule(params) {
	return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
	return request('/api/rule', {
		method: 'POST',
		body: {
			...params,
			method: 'delete',
		},
	});
}

export async function addRule(params) {
	return request('/api/rule', {
		method: 'POST',
		body: {
			...params,
			method: 'post',
		},
	});
}

export async function fakeSubmitForm(params) {
	return request('/api/forms', {
		method: 'POST',
		body: params,
	});
}

export async function fakeChartData() {
	return request('/api/fake_chart_data');
}

export async function queryTags() {
	return request('/api/tags');
}

export async function queryBasicProfile() {
	return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
	return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
	return request(`/api/fake_list?${stringify(params)}`);
}

export async function fakeAccountLogin(params) {
	return request('/api/login/account', {
		method: 'POST',
		body: params,
	});
}

//连接后端的登陆接口
export async function realUserLogin(params) {
	return requestMock('/api/login/account', {
		method: 'POST',
		body: params,
	});
}

//连接后端的退出登陆接口
export async function userLogOut() {
	return request('/pub/user/logOut', {
		method: 'POST',
	});
}

//连接后端的修改密码接口
export async function changePassword(params) {
	return request('/pub/user/changePwd', {
		method: 'POST',
		body: params,
	});
}

export async function fakeRegister(params) {
	return request('/api/register', {
		method: 'POST',
		body: params,
	});
}

export async function queryNotices() {
	return request('/api/notices');
}

//ranAdd 仪表盘部分获取数据排行信息--get请求
export async function getConversionAndClicksData() {
	return request('/api/conversionAndClicksData');
}

export async function queryNewCampaignList(params) {
	return request(`/api/getNewCampaignList?${stringify(params)}`);
}

//与接口数据匹配的api
export async function recent30d() {
	return request('/pub/dash/recent30d');
}
export async function queryByDateRange(params) {
	return request(`/pub/dash/queryByDateRange?${stringify(params)}`);
}
export async function lastestCampaigns() {
	return request('/pub/dash/latestCampaigns');
}
export async function latestUpdates() {
	return request('/pub/dash/latestUpdates');
}
export async function myCampaigns() {
	return request('/pub/dash/myCampaigns');
}
export async function campaigns(params) {
	return request('/pub/campaigns', {
		method: 'POST',
		body: params,
	});
}
//获取filterList的数据
export async function campaignOptions() {
	return request('/pub/campaigns/options');
}
export async function campaignDetails(id) {
	return request('/pub/campaigns/' + id);
}
export async function queryReportList(params) {
	return request(`/pub/report?${stringify(params)}`);
}

//添加获取billing接口
export async function queryBilling(params) {
	return request(`/pub/dash/billing?${stringify(params)}`);
}

export async function queryPannel(type) {
	if (!type) {
		return requestMock(`/pannel/list`);
	} else {
		return requestMock(`/pannel/list` + type);
	}
}

export async function filterFirstPannel() {
	return requestMock(`/pannel/listOne`);
}

export async function filterSecondPannel() {
	return requestMock(`/pannel/listTwo`);
}

export async function filterThirdPannel() {
	return requestMock(`/pannel/listThree`);
}
