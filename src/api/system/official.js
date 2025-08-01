import request from '@/utils/request'

// 查询官方公告列表
export function listOfficial(query) {
  return request({
    url: '/system/official/list',
    method: 'get',
    params: query
  })
}

// 查询官方公告详细
export function getOfficial(officialId) {
  return request({
    url: '/system/official/' + officialId,
    method: 'get'
  })
}

// 新增官方公告
export function addOfficial(data) {
  return request({
    url: '/system/official/add',
    method: 'post',
    data: data
  })
}

// 修改官方公告
export function updateOfficial(data) {
  return request({
    url: '/system/official/edit',
    method: 'put',
    data: data
  })
}

// 删除官方公告
export function delOfficial(officialId) {
  return request({
    url: '/system/official/' + officialId,
    method: 'delete'
  })
}
