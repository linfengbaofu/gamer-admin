import request from '@/utils/request'

// 查询球员信息列表
export function listPlayer(query) {
  return request({
    url: '/gamer/player/list',
    method: 'get',
    params: query
  })
}

// 查询球员信息详细
export function getPlayer(playerId) {
  return request({
    url: '/gamer/player/' + playerId,
    method: 'get'
  })
}

// 新增球员信息
export function addPlayer(data) {
  return request({
    url: '/gamer/player/add',
    method: 'post',
    data: data
  })
}

// 修改球员信息
export function updatePlayer(data) {
  return request({
    url: '/gamer/player/edit',
    method: 'put',
    data: data
  })
}

// 删除球员信息
export function delPlayer(playerId) {
  return request({
    url: '/gamer/player/' + playerId,
    method: 'delete'
  })
}
