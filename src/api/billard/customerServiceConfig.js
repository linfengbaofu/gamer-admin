import request from '@/utils/request'

// 查询客服配置列表
export function listCustomerServiceConfig(query) {
  return request({
    url: '/gamer/customerServiceConfig/list',
    method: 'get',
    params: query
  })
}

// 查询客服配置详细
export function getCustomerServiceConfig(configId) {
  return request({
    url: '/gamer/customerServiceConfig/' + configId,
    method: 'get'
  })
}

// 新增客服配置
export function addCustomerServiceConfig(data) {
  return request({
    url: '/gamer/customerServiceConfig/add',
    method: 'post',
    data: data
  })
}

// 修改客服配置
export function updateCustomerServiceConfig(data) {
  return request({
    url: '/gamer/customerServiceConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除客服配置
export function delCustomerServiceConfig(configId) {
  return request({
    url: '/gamer/customerServiceConfig/' + configId,
    method: 'delete'
  })
}
