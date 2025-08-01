import request from '@/utils/request'

// 查询俱乐部列表
export function listClub(query) {
  return request({
    url: '/gamer/club/list',
    method: 'get',
    params: query
  })
}

// 查询俱乐部详细
export function getClub(clubId) {
  return request({
    url: '/gamer/club/get/' + clubId,
    method: 'get'
  })
}

// 新增俱乐部
export function addClub(data) {
  return request({
    url: '/gamer/club/add',
    method: 'post',
    data: data
  })
}

// 修改俱乐部
export function updateClub(data) {
  return request({
    url: '/gamer/club/edit',
    method: 'put',
    data: data
  })
}

// 删除俱乐部
export function delClub(clubId) {
  return request({
    url: '/gamer/club/' + clubId,
    method: 'delete'
  })
}
