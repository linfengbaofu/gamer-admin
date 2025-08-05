import request from '@/utils/request'

// 查询礼品码记录列表
export function listGameCodeRecord(query) {
  return request({
    url: '/game/gameCodeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询礼品码记录详细
export function getGameCodeRecord(recordId) {
  return request({
    url: '/game/gameCodeRecord/' + recordId,
    method: 'get'
  })
}

// 新增礼品码记录
export function addGameCodeRecord(data) {
  return request({
    url: '/game/gameCodeRecord/add',
    method: 'post',
    data: data
  })
}

// 修改礼品码记录
export function updateGameCodeRecord(data) {
  return request({
    url: '/game/gameCodeRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除礼品码记录
export function delGameCodeRecord(recordId) {
  return request({
    url: '/game/gameCodeRecord/' + recordId,
    method: 'delete'
  })
}
