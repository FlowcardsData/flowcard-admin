import request from '@/utils/request'
import uploadRequest from '@/utils/uploadRequest'

// 获取下载路径
export function getUrl(data) {
  // debugger
  return request({
    url: '/video/getCutUploadUrl',
    method: 'post',
    data,
  })
}

// 获取商品下载路径
export function getStoreGoodUrl(data) {
  // debugger
  return request({
    url: '/storegoodvideo/getCutUploadUrl',
    method: 'post',
    data,
  })
}

// 远程下载
export function cloudDown(data) {
  return request({
    url: '/index/getCutDownUrl',
    method: 'post',
    data,
  })
}

// 检查文件上传状态
export function checkUploadState(params, config) {
  return uploadRequest({
    // url: '/api/upload/getUploadStatus',
    // url: '/api/video/getUploadStatus',
    method: 'post',
    data: params,
    ...config,
  })
}

// 检查文件上传
export function uploadFile(params, config) {
  return uploadRequest({
    // url: '/api/upload/chunk_upload',
    // url: '/api/video/chunk_upload',
    method: 'post',
    data: params,
    ...config,
  })
}

