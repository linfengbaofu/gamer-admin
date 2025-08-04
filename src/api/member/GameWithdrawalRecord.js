import request from '@/utils/request'

// 查询提现记录列表
export function listGameWithdrawalRecord(query) {
  return request({
    url: '/member/GameWithdrawalRecord/list',
    method: 'get',
    params: query
  })
}

// 查询提现记录详细
export function getGameWithdrawalRecord(id) {
  return request({
    url: '/member/GameWithdrawalRecord/' + id,
    method: 'get'
  })
}

// 新增提现记录
export function addGameWithdrawalRecord(data) {
  return request({
    url: '/member/GameWithdrawalRecord/add',
    method: 'post',
    data: data
  })
}

// 修改提现记录
export function updateGameWithdrawalRecord(data) {
  return request({
    url: '/member/GameWithdrawalRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除提现记录
export function delGameWithdrawalRecord(id) {
  return request({
    url: '/member/GameWithdrawalRecord/' + id,
    method: 'delete'
  })
}
