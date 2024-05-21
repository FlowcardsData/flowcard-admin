import request from '@/utils/request'
import uploadRequest from '@/utils/uploadRequest'

// 校验密码
export function checkPassword(data) {
  return request({
    url: '/User/checkPwd',
    method: 'post',
    data,
  })
}

// 获取字典
export function getConfigList(data) {
  return request({
    url: '/dictdata/getDictByCodenew',
    method: 'post',
    data,
  })
}

// 视频列表
export function getVideoList(data) {
  return request({
    url: '/video/index',
    method: 'post',
    data,
  })
}

// 视频删除
export function delVideo(data) {
  return request({
    url: '/video/delete',
    method: 'post',
    data,
  })
}

// 视频编辑
export function editVideo(data) {
  return request({
    url: '/video/edit',
    method: 'post',
    data,
  })
}
// 视频播放路径获取
export function getVideoInfo(id) {
  return request({
    url: '/video/info/?id=' + id,
    method: 'get',
  })
}

// 视频设置分类
export function setTypeVideo(data) {
  return request({
    url: '/video/setType',
    method: 'post',
    data,
  })
}

// 重置视频
export function resetVideo(data) {
  return request({
    url: '/video/reSet',
    method: 'post',
    data,
  })
}

// 视频审核
export function setStatusVideo(data) {
  return request({
    url: '/video/setStatus',
    method: 'post',
    data,
  })
}

// 分类列表
export function getClassList(data) {
  return request({
    url: '/tablename/index',
    method: 'post',
    data,
  })
}

// 删除分类
export function delClass(data) {
  return request({
    url: '/tablename/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑分类
export function editClass(data) {
  return request({
    url: '/tablename/edit',
    method: 'post',
    data,
  })
}

// 标签列表
export function getTagList(data) {
  return request({
    url: '/tag/index',
    method: 'post',
    data,
  })
}

// 删除标签
export function delTag(data) {
  return request({
    url: '/tag/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑标签
export function editTag(data) {
  return request({
    url: '/tag/edit',
    method: 'post',
    data,
  })
}

// 视频上传下载列表
export function getdownList(data) {
  return request({
    url: '/downvideo/index',
    method: 'post',
    data,
  })
}

// 添加/编辑远程下载
export function editDown(data) {
  return request({
    url: '/Downvideo/edit',
    method: 'post',
    data,
  })
}

// 删除远程下载
export function delDown(data) {
  return request({
    url: '/Downvideo/delete',
    method: 'post',
    data,
  })
}

// 视频文件下载
export function downVideo(data) {
  return uploadRequest({
    url: '/api/downvideo/download',
    method: 'post',
    data,
  })
}

// 视频文件重新下载
export function redownloadVideo(data) {
  return uploadRequest({
    url: '/api/downvideo/redownload',
    method: 'post',
    data,
  })
}

// 电视列表
export function getTvList(data) {
  return request({
    url: '/tv/index',
    method: 'post',
    data,
  })
}

// 电视删除
export function delTv(data) {
  return request({
    url: '/tv/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑电视
export function editTv(data) {
  return request({
    url: '/tv/edit',
    method: 'post',
    data,
  })
}

// 电视详情
export function getTvInfo(data) {
  return request({
    url: '/tv/info/',
    method: 'post',
    data,
  })
}

// 电视批量推荐
export function tuiTv(data) {
  return request({
    url: '/tv/setIsTui',
    method: 'post',
    data,
  })
}

// 电视批量分类
export function setTypeTv(data) {
  return request({
    url: '/tv/setType',
    method: 'post',
    data,
  })
}

// 电影批量分类
export function setTypeMv(data) {
  return request({
    url: '/mv/setType',
    method: 'post',
    data,
  })
}

// GV批量分类
export function setTypeGv(data) {
  return request({
    url: '/gv/setType',
    method: 'post',
    data,
  })
}

// 所有分类
export function getAllClass(data) {
  return request({
    url: '/tablename/getall',
    method: 'post',
    data,
  })
}

// 所有标签
export function getAllTagList(data) {
  return request({
    url: '/tag/getall',
    method: 'post',
    data,
  })
}

// 获取标签
export function getAllTag(data) {
  return request({
    url: '/tag/getall',
    method: 'post',
    data,
  })
}

// 运营gv列表
export function getDevopsGvList(data) {
  return request({
    url: '/gv/devopsGvList',
    method: 'post',
    data,
  })
}

// 添加运营GV
export function devopsGvAdd(data) {
  return request({
    url: '/gv/devopsGvAdd',
    method: 'post',
    data,
  })
}

// 编辑运营GV
export function devopsGvEdit(data) {
  return request({
    url: '/gv/devopsGvedit',
    method: 'post',
    data,
  })
}

// 运营GV详情
export function devopsGvDetail(data) {
  return request({
    url: '/gv/info',
    method: 'post',
    data,
  })
}

// 删除运营GV
export function devopsGvDelete(data) {
  return request({
    url: '/gv/delete',
    method: 'post',
    data,
  })
}

// 运营GV设置分类
export function devopsGvSetType(data) {
  return request({
    url: '/gv/setType',
    method: 'post',
    data,
  })
}

// 运营GV审核
export function devopsGvSetStatus(data) {
  return request({
    url: '/gv/devopsGvSetStatus',
    method: 'post',
    data,
  })
}

// 111111111111111

// 用户gv列表
export function getClientGvList(data) {
  return request({
    url: '/gv/clientGvList',
    method: 'post',
    data,
  })
}

// 添加用户GV
export function clientGvAdd(data) {
  return request({
    url: '/gv/clientGvAdd',
    method: 'post',
    data,
  })
}

// 编辑用户GV
export function clientGvEdit(data) {
  return request({
    url: '/gv/clientGvEdit',
    method: 'post',
    data,
  })
}

// 删除用户GV
export function clientGvDelete(data) {
  return request({
    url: '/gv/clientGvDelete',
    method: 'post',
    data,
  })
}

// 用户GV设置分类
export function clientGvSetType(data) {
  return request({
    url: '/gv/clientGvSetType',
    method: 'post',
    data,
  })
}

// 用户GV审核
export function clientGvSetStatus(data) {
  return request({
    url: '/gv/clientGvSetStatus',
    method: 'post',
    data,
  })
}

// 111111

// GV列表
export function getGvList(data) {
  return request({
    url: '/gv/index',
    method: 'post',
    data,
  })
}

// GV删除
export function delGv(data) {
  return request({
    url: '/gv/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑GV
export function editGv(data) {
  return request({
    url: '/gv/edit',
    method: 'post',
    data,
  })
}

// Gv推荐
export function tuiGv(data) {
  return request({
    url: '/gv/setIsRecommend',
    method: 'post',
    data,
  })
}

// Gv上下架
export function onsaleGv(data) {
  return request({
    url: '/gv/onsale',
    method: 'post',
    data,
  })
}

// 电影上下架
export function onsaleMv(data) {
  return request({
    url: '/mv/onsale',
    method: 'post',
    data,
  })
}

// 电视上下架
export function onsaleTv(data) {
  return request({
    url: '/tv/onsale',
    method: 'post',
    data,
  })
}

// 电影列表
export function getMovieList(data) {
  return request({
    url: '/mv/index',
    method: 'post',
    data,
  })
}

// 电影删除
export function delMovie(data) {
  return request({
    url: '/mv/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑电影
export function editMovie(data) {
  return request({
    url: '/mv/edit',
    method: 'post',
    data,
  })
}

// 电影详情
export function getMovieDetail(data) {
  return request({
    url: '/mv/info',
    method: 'post',
    data,
  })
}

// 电影批量推荐
export function tuiMv(data) {
  return request({
    url: '/mv/setIsTui',
    method: 'post',
    data,
  })
}

// 演员列表
export function getActorList(data) {
  return request({
    url: '/actor/index',
    method: 'post',
    data,
  })
}

// 演员删除
export function delActor(data) {
  return request({
    url: '/actor/delete',
    method: 'post',
    data,
  })
}

// 添加/编辑演员
export function editActor(data) {
  return request({
    url: '/actor/edit',
    method: 'post',
    data,
  })
}

// 获取续集列表
export function getSequelList(data) {
  return request({
    url: '/tvvideo/index',
    method: 'post',
    data,
  })
}

// 删除续集
export function delSequel(data) {
  return request({
    url: '/tvvideo/delete',
    method: 'post',
    data,
  })
}

// 添加续集
export function addSequel(data) {
  return request({
    url: '/tvvideo/edit',
    method: 'post',
    data,
  })
}

// 上传文件
// export function upload(data) {
//   return request({
//     url: '/Upload/uploadImage',
//     method: 'post',
//     data,
//   })
// }
//  TODO: /Upload/uploadFile
export function upload(data, onUploadProgress) {
  return request({
    url: '/Upload/uploadImage',
    method: 'post',
    data,
    onUploadProgress,
  })
}

// 电视设置标签
export function setTagTv(data) {
  return request({
    url: '/tv/setTag',
    method: 'post',
    data,
  })
}

// GV设置标签
export function setTagGv(data) {
  return request({
    url: '/gv/setTag',
    method: 'post',
    data,
  })
}
// 电影设置标签
export function setTagMv(data) {
  return request({
    url: '/mv/setTag',
    method: 'post',
    data,
  })
}

// 视频管理设置标签
export function setTagVideo(data) {
  return request({
    url: '/video/setTag',
    method: 'post',
    data,
  })
}

// 豆瓣采集接口
export function getDouban(data) {
  return request({
    url: '/douban/index',
    method: 'post',
    data,
  })
}

// 上传检测
export function checkUploadVideo(data) {
  return uploadRequest({
    url: '/api/Upload/checkUploadVideo',
    method: 'post',
    data,
  })
}

// 上传视频
export function uploadVideo(data, config = {}) {
  return uploadRequest({
    url: '/api/upload/uploadVideo',
    method: 'post',
    data,
    ...config,
  })
}

// 电影审核
export function setStatusMv(data) {
  return request({
    url: '/mv/setStatus',
    method: 'post',
    data,
  })
}

// 电视审核
export function setStatusTv(data) {
  return request({
    url: '/tv/setStatus',
    method: 'post',
    data,
  })
}

// 封面30张图
export function getPic(data) {
  return request({
    url: '/video/getpic',
    method: 'post',
    data,
  })
}

// 设置封面
export function setPic(data) {
  return request({
    url: '/video/setpic',
    method: 'post',
    data,
  })
}

// 电视批量删除
export function tvBatchDelete(data) {
  return request({
    url: '/tv/batchDelete',
    method: 'post',
    data,
  })
}
// 电视批量删除
export function mvBatchDelete(data) {
  return request({
    url: '/mv/batchDelete',
    method: 'post',
    data,
  })
}

// 视频批量删除
export function videoBatchDelete(data) {
  return request({
    url: '/video/batchDelete',
    method: 'post',
    data,
  })
}

// 运营gv批量删除
export function gvBatchDelete(data) {
  return request({
    url: '/gv/delete',
    method: 'post',
    data,
  })
}

// 用户gv批量删除
export function userGvBatchDelete(data) {
  return request({
    url: '/gv/clientBatchDelete',
    method: 'post',
    data,
  })
}

// 标签批量删除
export function tagBatchDelete(data) {
  return request({
    url: '/tag/batchDelete',
    method: 'post',
    data,
  })
}

// 分类批量删除
export function classBatchDelete(data) {
  return request({
    url: '/tablename/batchDelete',
    method: 'post',
    data,
  })
}
// 上传下载批量删除
export function uploadBatchDelete(data) {
  return request({
    url: '/Downvideo/batchDelete',
    method: 'post',
    data,
  })
}

// 视频待审核列表
export function videoCheckList(data) {
  return request({
    url: '/videoSub/index',
    method: 'post',
    data,
  })
}

// 视频待审核删除
export function videoCheckDel(data) {
  return request({
    url: '/videoSub/delete',
    method: 'post',
    data,
  })
}

// 视频待审核批量删除
export function videoCheckBatchDelete(data) {
  return request({
    url: '/videoSub/batchDelete',
    method: 'post',
    data,
  })
}
// 视频待审核批量审核
export function videoCheckSetStatus(data) {
  return request({
    url: '/videoSub/setStatus',
    method: 'post',
    data,
  })
}

// 电视待审核列表
export function tvCheckList(data) {
  return request({
    url: '/tvSub/index',
    method: 'post',
    data,
  })
}

// 电视待审核删除
export function tvCheckDel(data) {
  return request({
    url: '/tvSub/delete',
    method: 'post',
    data,
  })
}

// 电视待审核批量删除
export function tvCheckBatchDelete(data) {
  return request({
    url: '/tvSub/batchDelete',
    method: 'post',
    data,
  })
}
// 电视待审核批量审核
export function tvCheckSetStatus(data) {
  return request({
    url: '/tvSub/setStatus',
    method: 'post',
    data,
  })
}

// 电影待审核列表
export function mvCheckList(data) {
  return request({
    url: '/mvSub/index',
    method: 'post',
    data,
  })
}

// 电影待审核删除
export function mvCheckDel(data) {
  return request({
    url: '/mvSub/delete',
    method: 'post',
    data,
  })
}

// 电影待审核批量删除
export function mvCheckBatchDelete(data) {
  return request({
    url: '/mvSub/batchDelete',
    method: 'post',
    data,
  })
}
// 电影待审核批量审核
export function mvCheckSetStatus(data) {
  return request({
    url: '/mvSub/setStatus',
    method: 'post',
    data,
  })
}

// gv待审核列表
export function gvCheckList(data) {
  return request({
    url: '/gvSub/index',
    method: 'post',
    data,
  })
}

// gv待审核删除
export function gvCheckDel(data) {
  return request({
    url: '/gvSub/delete',
    method: 'post',
    data,
  })
}

// gv待审核批量删除
export function gvCheckBatchDelete(data) {
  return request({
    url: '/gvSub/batchDelete',
    method: 'post',
    data,
  })
}
// gv待审核批量审核
export function gvCheckSetStatus(data) {
  return request({
    url: '/gvSub/setStatus',
    method: 'post',
    data,
  })
}

// 不能播放状态调整
export function setPlayStatus(data) {
  return request({
    url: '/Report/process',
    method: 'post',
    data,
  })
}

// 获取支付渠道
export function getPayChannel(data) {
  return request({
    url: '/PaymentChannel/index',
    method: 'post',
    data,
  })
}

// 创建视频集合
export function createVideoSet(data) {
  return request({
    url: '/Gvcollect/edit',
    method: 'post',
    data,
  })
}

// 删除视频集合
export function deleteVideoSet(data) {
  return request({
    url: '/Gvcollect/delete',
    method: 'post',
    data,
  })
}

// 获取视频集合详情
export function getVideoSetDetail(data) {
  return request({
    url: '/Gvcollect/info',
    method: 'post',
    data,
  })
}
// 更新视频上传后的状态
export function updateVideoStatus(data) {
  return request({
    url: '/Gv/upOk',
    method: 'post',
    data,
  })
}

// 更新mv 上传后的状态
export function updateMvStatus(data) {
  return request({
    url: '/Mv/upOk',
    method: 'post',
    data,
  })
}

// 更新tv 上传后的状态
export function updateTvStatus(data) {
  return request({
    url: '/Tvvideo/upOk',
    method: 'post',
    data,
  })
}

// 重新转码视频
export function reTranscode(data) {
  return request({
    url: '/Video/reSetCut',
    method: 'post',
    data,
  })
}

// 设置 GV 是否限免
export function setGvIsFree(data) {
  return request({
    url: '/Gv/setFree',
    method: 'post',
    data,
  })
}

// 重新下载视频
export function reDownload(data) {
  return request({
    url: '/Video/reDown',
    method: 'post',
    data,
  })
}
