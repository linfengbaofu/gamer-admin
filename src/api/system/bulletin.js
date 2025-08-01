import request from '@/utils/request'

// 查询平台公告列表
export function listBulletin(query) {
  return request({
    url: '/system/bulletin/list',
    method: 'get',
    params: query
  })
}

// 查询平台公告详细
export function getBulletin(bulletinId) {
  return request({
    url: '/system/bulletin/' + bulletinId,
    method: 'get'
  })
}

// 新增平台公告
export function addBulletin(data) {
  return request({
    url: '/system/bulletin/add',
    method: 'post',
    data: data
  })
}

// 修改平台公告
export function updateBulletin(data) {
  return request({
    url: '/system/bulletin/edit',
    method: 'put',
    data: data
  })
}

// 删除平台公告
export function delBulletin(bulletinId) {
  return request({
    url: '/system/bulletin/' + bulletinId,
    method: 'delete'
  })
}
