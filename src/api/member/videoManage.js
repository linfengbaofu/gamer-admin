import request from '@/utils/request'

// 查询台球视频集锦管理列表
export function listVideoManage(query) {
  return request({
    url: '/member/videoManage/list',
    method: 'get',
    params: query
  })
}

// 查询台球视频集锦管理详细
export function getVideoManage(videoId) {
  return request({
    url: '/member/videoManage/get/' + videoId,
    method: 'get'
  })
}

// 新增台球视频集锦管理
export function addVideoManage(data) {
  return request({
    url: '/member/videoManage/add',
    method: 'post',
    data: data
  })
}

// 修改台球视频集锦管理
export function updateVideoManage(data) {
  return request({
    url: '/member/videoManage/edit',
    method: 'put',
    data: data
  })
}

// 删除台球视频集锦管理
export function delVideoManage(videoId) {
  return request({
    url: '/member/videoManage/' + videoId,
    method: 'delete'
  })
}
