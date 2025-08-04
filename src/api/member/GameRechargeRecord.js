import request from '@/utils/request'

// 查询充值记录列表
export function listGameRechargeRecord(query) {
  return request({
    url: '/member/GameRechargeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询充值记录详细
export function getGameRechargeRecord(id) {
  return request({
    url: '/member/GameRechargeRecord/' + id,
    method: 'get'
  })
}

// 新增充值记录
export function addGameRechargeRecord(data) {
  return request({
    url: '/member/GameRechargeRecord/add',
    method: 'post',
    data: data
  })
}

// 修改充值记录
export function updateGameRechargeRecord(data) {
  return request({
    url: '/member/GameRechargeRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除充值记录
export function delGameRechargeRecord(id) {
  return request({
    url: '/member/GameRechargeRecord/' + id,
    method: 'delete'
  })
}
