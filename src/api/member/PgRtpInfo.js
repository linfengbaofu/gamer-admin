import request from '@/utils/request'

// 查询PGrtp信息列表
export function listPgRtpInfo(query) {
  return request({
    url: '/member/PgRtpInfo/list',
    method: 'get',
    params: query
  })
}

// 查询PGrtp信息详细
export function getPgRtpInfo(id) {
  return request({
    url: '/member/PgRtpInfo/' + id,
    method: 'get'
  })
}

// 新增PGrtp信息
export function addPgRtpInfo(data) {
  return request({
    url: '/member/PgRtpInfo/add',
    method: 'post',
    data: data
  })
}

// 修改PGrtp信息
export function updatePgRtpInfo(data) {
  return request({
    url: '/member/PgRtpInfo/edit',
    method: 'put',
    data: data
  })
}

// 删除PGrtp信息
export function delPgRtpInfo(id) {
  return request({
    url: '/member/PgRtpInfo/' + id,
    method: 'delete'
  })
}
