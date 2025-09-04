import request from '@/utils/request'

// 查询pg游戏rtp控制列表
export function listPgGameRtp(query) {
  return request({
    url: '/member/PgGameRtp/list',
    method: 'get',
    params: query
  })
}

// 查询pg游戏rtp控制详细
export function getPgGameRtp(id) {
  return request({
    url: '/member/PgGameRtp/' + id,
    method: 'get'
  })
}

// 新增pg游戏rtp控制
export function addPgGameRtp(data) {
  return request({
    url: '/member/PgGameRtp/add',
    method: 'post',
    data: data
  })
}

// 修改pg游戏rtp控制
export function updatePgGameRtp(data) {
  return request({
    url: '/member/PgGameRtp/edit',
    method: 'put',
    data: data
  })
}

// 删除pg游戏rtp控制
export function delPgGameRtp(id) {
  return request({
    url: '/member/PgGameRtp/' + id,
    method: 'delete'
  })
}
