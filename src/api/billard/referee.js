import request from '@/utils/request'

// 查询裁判信息列表
export function listReferee(query) {
  return request({
    url: '/gamer/referee/list',
    method: 'get',
    params: query
  })
}

// 查询裁判信息详细
export function getReferee(refereeId) {
  return request({
    url: '/gamer/referee/' + refereeId,
    method: 'get'
  })
}

// 新增裁判信息
export function addReferee(data) {
  return request({
    url: '/gamer/referee/add',
    method: 'post',
    data: data
  })
}

// 修改裁判信息
export function updateReferee(data) {
  return request({
    url: '/gamer/referee/edit',
    method: 'put',
    data: data
  })
}

// 删除裁判信息
export function delReferee(refereeId) {
  return request({
    url: '/gamer/referee/' + refereeId,
    method: 'delete'
  })
}
