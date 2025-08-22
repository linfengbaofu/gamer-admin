import request from '@/utils/request'

// 查询游戏倍率列表
export function listGameLbBetConfig(query) {
  return request({
    url: '/game/gameLbBetConfig/list',
    method: 'get',
    params: query
  })
}

// 查询游戏倍率详细
export function getGameLbBetConfig(configId) {
  return request({
    url: '/game/gameLbBetConfig/' + configId,
    method: 'get'
  })
}

// 新增游戏倍率
export function addGameLbBetConfig(data) {
  return request({
    url: '/game/gameLbBetConfig/add',
    method: 'post',
    data: data
  })
}

// 修改游戏倍率
export function updateGameLbBetConfig(data) {
  return request({
    url: '/game/gameLbBetConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏倍率
export function delGameLbBetConfig(configId) {
  return request({
    url: '/game/gameLbBetConfig/' + configId,
    method: 'delete'
  })
}
