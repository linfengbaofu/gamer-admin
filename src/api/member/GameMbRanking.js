import request from '@/utils/request'

// 查询玩家下注排行列表
export function listGameMbRanking(query) {
  return request({
    url: '/member/GameMbRanking/list',
    method: 'get',
    params: query
  })
}

// 查询玩家下注排行详细
export function getGameMbRanking(id) {
  return request({
    url: '/member/GameMbRanking/' + id,
    method: 'get'
  })
}

// 新增玩家下注排行
export function addGameMbRanking(data) {
  return request({
    url: '/member/GameMbRanking/add',
    method: 'post',
    data: data
  })
}

// 修改玩家下注排行
export function updateGameMbRanking(data) {
  return request({
    url: '/member/GameMbRanking/edit',
    method: 'put',
    data: data
  })
}

// 删除玩家下注排行
export function delGameMbRanking(id) {
  return request({
    url: '/member/GameMbRanking/' + id,
    method: 'delete'
  })
}
