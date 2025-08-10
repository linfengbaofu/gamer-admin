import request from '@/utils/request'

// 查询游戏会员报表列表
export function listGameMbReport(query) {
  return request({
    url: '/game/gameMbReport/list',
    method: 'get',
    params: query
  })
}

// 查询游戏会员报表详细
export function getGameMbReport(id) {
  return request({
    url: '/game/gameMbReport/' + id,
    method: 'get'
  })
}

// 新增游戏会员报表
export function addGameMbReport(data) {
  return request({
    url: '/game/gameMbReport/add',
    method: 'post',
    data: data
  })
}

// 修改游戏会员报表
export function updateGameMbReport(data) {
  return request({
    url: '/game/gameMbReport/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏会员报表
export function delGameMbReport(id) {
  return request({
    url: '/game/gameMbReport/' + id,
    method: 'delete'
  })
}
