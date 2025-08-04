import request from '@/utils/request'

// 查询注单记录列表
export function listGameRecord(query) {
  return request({
    url: '/member/GameRecord/list',
    method: 'get',
    params: query
  })
}

// 查询注单记录详细
export function getGameRecord(id) {
  return request({
    url: '/member/GameRecord/' + id,
    method: 'get'
  })
}

// 新增注单记录
export function addGameRecord(data) {
  return request({
    url: '/member/GameRecord/add',
    method: 'post',
    data: data
  })
}

// 修改注单记录
export function updateGameRecord(data) {
  return request({
    url: '/member/GameRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除注单记录
export function delGameRecord(id) {
  return request({
    url: '/member/GameRecord/' + id,
    method: 'delete'
  })
}
