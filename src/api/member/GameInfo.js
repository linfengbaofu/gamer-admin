import request from '@/utils/request'

// 查询游戏列表列表
export function listGameInfo(query) {
  return request({
    url: '/member/GameInfo/list',
    method: 'get',
    params: query
  })
}

// 查询游戏列表详细
export function getGameInfo(id) {
  return request({
    url: '/member/GameInfo/' + id,
    method: 'get'
  })
}

// 新增游戏列表
export function addGameInfo(data) {
  return request({
    url: '/member/GameInfo/add',
    method: 'post',
    data: data
  })
}

// 修改游戏列表
export function updateGameInfo(data) {
  return request({
    url: '/member/GameInfo/edit',
    method: 'put',
    data: data
  })
}

// 删除游戏列表
export function delGameInfo(id) {
  return request({
    url: '/member/GameInfo/' + id,
    method: 'delete'
  })
}
