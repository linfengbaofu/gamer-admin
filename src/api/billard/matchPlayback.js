import request from '@/utils/request'

// 查询赛事回放列表
export function listMatchPlayback(query) {
  return request({
    url: '/gamer/matchPlayback/list',
    method: 'get',
    params: query
  })
}

// 查询赛事回放详细
export function getMatchPlayback(playbackId) {
  return request({
    url: '/gamer/matchPlayback/get/' + playbackId,
    method: 'get'
  })
}

// 新增赛事回放
export function addMatchPlayback(data) {
  return request({
    url: '/gamer/matchPlayback/add',
    method: 'post',
    data: data
  })
}

// 修改赛事回放
export function updateMatchPlayback(data) {
  return request({
    url: '/gamer/matchPlayback/edit',
    method: 'put',
    data: data
  })
}

// 删除赛事回放
export function delMatchPlayback(playbackId) {
  return request({
    url: '/gamer/matchPlayback/' + playbackId,
    method: 'delete'
  })
}
