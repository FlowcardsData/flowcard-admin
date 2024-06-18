// import Vue from 'vue';
// 根据字典类型查询字典数据信息
// export function getDicts(dictType) {
// return Vue.axios.get('/Dictdata/getDictByCode/',{params: {'code':dictType}}).then(res => {       
//     return res.data
//     });   
// }
// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].code == ('' + value)) {
			actions.push(datas[key].name);
			return true;
		}
	})
	return actions.join('');
}

// 回显图片
export function defendantImage(img) {
	if (typeof img === 'string') {
		return img;
	}
	//返回默认图片
	// if(!img || img === null) return '/img/404.9f74df08.jpg';
	if(!img || img === null) return '';
	return img[0];
}
