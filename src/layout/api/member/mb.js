import request from '@/utils/request'

// 查询期权用户列表
export function listMb(query) {
  return request({
    url: '/member/mb/list',
    method: 'get',
    params: query
  })
}

// 查询期权用户详细
export function getMb(mbId) {
  return request({
    url: '/member/mb/' + mbId,
    method: 'get'
  })
}

// 新增期权用户
export function addMb(data) {
  return request({
    url: '/member/mb/add',
    method: 'post',
    data: data
  })
}

// 修改期权用户
export function updateMb(data) {
  return request({
    url: '/member/mb/edit',
    method: 'put',
    data: data
  })
}

// 删除期权用户
export function delMb(mbId) {
  return request({
    url: '/member/mb/' + mbId,
    method: 'delete'
  })
}
