import request from '@/utils/request'

// 查询游戏会员每日报列表
export function listGameDayMbReport(query) {
  return request({
    url: '/game/gameDayMbReport/list',
    method: 'get',
    params: query
  })
}

// 查询游戏会员每日报详细
export function getGameDayMbReport(id) {
  return request({
    url: '/game/gameDayMbReport/' + id,
    method: 'get'
  })
}

// 新增游戏会员每日报
export function addGameDayMbReport(data) {
  return request({
    url: '/game/gameDayMbReport/add',
    method: 'post',
    data: data
  })
}

// 修改游戏会员每日报
export function updateGameDayMbReport(data) {
  return request({
    url: '/game/gameDayMbReport/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏会员每日报
export function delGameDayMbReport(id) {
  return request({
    url: '/game/gameDayMbReport/' + id,
    method: 'delete'
  })
}
