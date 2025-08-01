import request from '@/utils/request'

// 查询赛事列表
export function listMatch(query) {
  return request({
    url: '/gamer/match/list',
    method: 'get',
    params: query
  })
}

// 查询赛事详细
export function getMatch(matchId) {
  return request({
    url: '/gamer/match/' + matchId,
    method: 'get'
  })
}

// 新增赛事
export function addMatch(data) {
  return request({
    url: '/gamer/match/add',
    method: 'post',
    data: data
  })
}

// 修改赛事
export function updateMatch(data) {
  return request({
    url: '/gamer/match/edit',
    method: 'put',
    data: data
  })
}

// 删除赛事
export function delMatch(matchId) {
  return request({
    url: '/gamer/match/' + matchId,
    method: 'delete'
  })
}
