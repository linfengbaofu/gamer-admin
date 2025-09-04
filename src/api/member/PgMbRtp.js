import request from '@/utils/request'

// 查询用户rtp控制列表
export function listPgMbRtp(query) {
  return request({
    url: '/member/PgMbRtp/list',
    method: 'get',
    params: query
  })
}

// 查询用户rtp控制详细
export function getPgMbRtp(id) {
  return request({
    url: '/member/PgMbRtp/' + id,
    method: 'get'
  })
}

// 新增用户rtp控制
export function addPgMbRtp(data) {
  return request({
    url: '/member/PgMbRtp/add',
    method: 'post',
    data: data
  })
}

// 修改用户rtp控制
export function updatePgMbRtp(data) {
  return request({
    url: '/member/PgMbRtp/edit',
    method: 'put',
    data: data
  })
}

// 删除用户rtp控制
export function delPgMbRtp(id) {
  return request({
    url: '/member/PgMbRtp/' + id,
    method: 'delete'
  })
}
