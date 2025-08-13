import request from '@/utils/request'

// 查询游戏排行设置列表
export function listGameRankingConfig(query) {
  return request({
    url: '/game/gameRankingConfig/list',
    method: 'get',
    params: query
  })
}

// 查询游戏排行设置详细
export function getGameRankingConfig(id) {
  return request({
    url: '/game/gameRankingConfig/' + id,
    method: 'get'
  })
}

// 新增游戏排行设置
export function addGameRankingConfig(data) {
  return request({
    url: '/game/gameRankingConfig/add',
    method: 'post',
    data: data
  })
}

// 修改游戏排行设置
export function updateGameRankingConfig(data) {
  return request({
    url: '/game/gameRankingConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏排行设置
export function delGameRankingConfig(id) {
  return request({
    url: '/game/gameRankingConfig/' + id,
    method: 'delete'
  })
}
