import md5 from 'md5';
//获取当前日期
export function getDate(i) {
	var myDate = new Date();
	var lw = new Date(myDate - 1000 * 60 * 60 * 24 * i); //最后一个数字30可改，30天的意思
	var lastY = lw.getFullYear();
	var lastM = lw.getMonth() + 1;
	var lastD = lw.getDate();
	var startdate =
		lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD); //三十天之前日期
	return startdate;
}

//获取当月第一天的日期
export function getTheFirstDay() {
	var myDate = new Date();
	var lw = new Date(myDate); //最后一个数字30可改，30天的意思
	var lastY = lw.getFullYear();
	var lastM = lw.getMonth() + 1;
	var firstDay = lastY + '-' + (lastM < 10 ? '0' + lastM : lastM) + '-' + '01'; //三十天之前日期
	return firstDay;
}

export function getDateWithoutYear(i) {
	var myDate = new Date();
	var lw = new Date(myDate - 1000 * 60 * 60 * 24 * i); //最后一个数字30可改，30天的意思
	var lastY = lw.getFullYear();
	var lastM = lw.getMonth() + 1;
	var lastD = lw.getDate();
	var startdate = (lastM < 10 ? '0' + lastM : lastM) + '-' + (lastD < 10 ? '0' + lastD : lastD); //三十天之前日期
	return startdate;
}

export function getProgressSpeed(startTime, endTime) {
	var startTime = new Date(startTime);
	var endTime = new Date(endTime);
	var myDate = new Date();
	var speed = (myDate - startTime) / (endTime - startTime);
	var speedPoint = null;
	if (speed <= 0) {
		speedPoint = 0;
	} else if (speed > 0 && speed < 1) {
		speedPoint = parseInt(speed * 100);
	} else {
		speedPoint = 100;
	}
	return speedPoint;
}

export function getProgressSpeedByCaps(delived_caps, daily_cap) {
	var speed = delived_caps ? delived_caps / daily_cap : 0;
	var speedPoint = null;
	if (speed <= 0) {
		speedPoint = 0;
	} else if (speed > 0 && speed < 1) {
		speedPoint = parseInt(speed * 100);
	} else {
		speedPoint = 100;
	}
	return speedPoint;
}

export function getParam(name) {
	var hash = window.location.hash;
	var search = '?' + hash.split('?')[1];
	var pattern = new RegExp('[?&]' + name + '=([^&]+)', 'g');
	var matcher = pattern.exec(search);
	var items = null;
	if (null != matcher) {
		try {
			items = decodeURIComponent(decodeURIComponent(matcher[1]));
		} catch (e) {
			try {
				items = decodeURIComponent(matcher[1]);
			} catch (e) {
				items = matcher[1];
			}
		}
	}
	return items;
}

//拼接字符串
export function splicingCharacter(...args) {
	let arr1 = args;
	return arr1.filter(item => item).join(',');
	// return items;
}

/**
 ** 乘法函数，用来得到精确的乘法结果
 ** 说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
 ** 调用：accMul(arg1,arg2)
 ** 返回值：arg1乘以 arg2的精确结果
 **/
export function accMul(arg1, arg2) {
	var m = 0,
		s1 = arg1.toString(),
		s2 = arg2.toString();
	try {
		m += s1.split('.')[1].length;
	} catch (e) {}
	try {
		m += s2.split('.')[1].length;
	} catch (e) {}
	return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}

// 给Number类型增加一个mul方法，调用起来更加方便。
// Number.prototype.mul = function (arg) {
//     return accMul(arg, this);
// };

//深拷贝
export function deepCloneObj(obj) {
	var str,
		newobj = obj.constructor === Array ? [] : {};
	if (typeof obj !== 'object') {
		return;
	} else if (window.JSON) {
		(str = JSON.stringify(obj)), //系列化对象
			(newobj = JSON.parse(str)); //还原
	} else {
		for (var i in obj) {
			newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
		}
	}
	return newobj;
}

export function getImgUrl(page_id, timestamp) {
	let userInfo = JSON.parse(sessionStorage.getItem('loginUserInfo'));
	let user_id = userInfo.id;
	let checksum = md5('moca-publisher;' + timestamp);
	let url = `http://192.168.31.15:8090/pageReport/visit?page_id=${page_id}&timestamp=${timestamp}&checksum=${checksum}&user_id=${user_id}`;
	return url;
}
