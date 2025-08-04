import request from '@/utils/request'

// 查询用户喜欢游戏列表
export function listMbLikeGame(query) {
  return request({
    url: '/member/MbLikeGame/list',
    method: 'get',
    params: query
  })
}

// 查询用户喜欢游戏详细
export function getMbLikeGame(id) {
  return request({
    url: '/member/MbLikeGame/' + id,
    method: 'get'
  })
}

// 新增用户喜欢游戏
export function addMbLikeGame(data) {
  return request({
    url: '/member/MbLikeGame/add',
    method: 'post',
    data: data
  })
}

// 修改用户喜欢游戏
export function updateMbLikeGame(data) {
  return request({
    url: '/member/MbLikeGame/edit',
    method: 'put',
    data: data
  })
}

// 删除用户喜欢游戏
export function delMbLikeGame(id) {
  return request({
    url: '/member/MbLikeGame/' + id,
    method: 'delete'
  })
}
