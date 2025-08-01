import request from '@/utils/request'

// 查询会员提现配置列表
export function listWithdrawalConfig(query) {
  return request({
    url: '/member/withdrawalConfig/list',
    method: 'get',
    params: query
  })
}

// 查询会员提现配置详细
export function getWithdrawalConfig(configId) {
  return request({
    url: '/member/withdrawalConfig/' + configId,
    method: 'get'
  })
}

// 新增会员提现配置
export function addWithdrawalConfig(data) {
  return request({
    url: '/member/withdrawalConfig/add',
    method: 'post',
    data: data
  })
}

// 修改会员提现配置
export function updateWithdrawalConfig(data) {
  return request({
    url: '/member/withdrawalConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除会员提现配置
export function delWithdrawalConfig(configId) {
  return request({
    url: '/member/withdrawalConfig/' + configId,
    method: 'delete'
  })
}
