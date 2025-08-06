import request from '@/utils/request'

// 查询用户提现配置列表
export function listMbWithdrawalConfig(query) {
  return request({
    url: '/member/MbWithdrawalConfig/list',
    method: 'get',
    params: query
  })
}

// 查询用户提现配置详细
export function getMbWithdrawalConfig(mbId) {
  return request({
    url: '/member/MbWithdrawalConfig/' + mbId,
    method: 'get'
  })
}

// 新增用户提现配置
export function addMbWithdrawalConfig(data) {
  return request({
    url: '/member/MbWithdrawalConfig/add',
    method: 'post',
    data: data
  })
}

// 修改用户提现配置
export function updateMbWithdrawalConfig(data) {
  return request({
    url: '/member/MbWithdrawalConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除用户提现配置
export function delMbWithdrawalConfig(mbId) {
  return request({
    url: '/member/MbWithdrawalConfig/' + mbId,
    method: 'delete'
  })
}
