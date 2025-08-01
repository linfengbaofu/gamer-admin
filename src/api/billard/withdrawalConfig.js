import request from '@/utils/request'

// 查询充值配置列表
export function listWithdrawalConfig(query) {
  return request({
    url: '/gamer/withdrawalConfig/list',
    method: 'get',
    params: query
  })
}

// 查询充值配置详细
export function getWithdrawalConfig() {
  return request({
    url: '/gamer/withdrawalConfig/get',
    method: 'get'
  })
}

// 新增充值配置
export function addWithdrawalConfig(data) {
  return request({
    url: '/gamer/withdrawalConfig/add',
    method: 'post',
    data: data
  })
}

// 修改充值配置
export function updateWithdrawalConfig(data) {
  return request({
    url: '/gamer/withdrawalConfig/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除充值配置
export function delWithdrawalConfig(configId) {
  return request({
    url: '/gamer/withdrawalConfig/' + configId,
    method: 'delete'
  })
}
