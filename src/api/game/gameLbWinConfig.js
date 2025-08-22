import request from '@/utils/request'

// 查询游戏输赢控制列表
export function listGameLbWinConfig(query) {
  return request({
    url: '/game/gameLbWinConfig/list',
    method: 'get',
    params: query
  })
}

// 查询游戏输赢控制详细
export function getGameLbWinConfig(configId) {
  return request({
    url: '/game/gameLbWinConfig/' + configId,
    method: 'get'
  })
}

// 新增游戏输赢控制
export function addGameLbWinConfig(data) {
  return request({
    url: '/game/gameLbWinConfig/add',
    method: 'post',
    data: data
  })
}

// 修改游戏输赢控制
export function updateGameLbWinConfig(data) {
  return request({
    url: '/game/gameLbWinConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏输赢控制
export function delGameLbWinConfig(configId) {
  return request({
    url: '/game/gameLbWinConfig/' + configId,
    method: 'delete'
  })
}
