import request from '@/utils/request'

// 查询充值配置列表
export function listRechargeConfig(query) {
  return request({
    url: '/gamer/rechargeConfig/list',
    method: 'get',
    params: query
  })
}

// 查询充值配置详细
export function getRechargeConfig() {
  return request({
    url: '/gamer/rechargeConfig/get',
    method: 'get'
  })
}

// 新增充值配置
export function addRechargeConfig(data) {
  return request({
    url: '/gamer/rechargeConfig/add',
    method: 'post',
    data: data
  })
}

// 修改充值配置
export function updateRechargeConfig(data) {
  return request({
    url: '/gamer/rechargeConfig/saveOrUpdate',
    method: 'post',
    data: data
  })
}

// 删除充值配置
export function delRechargeConfig(configId) {
  return request({
    url: '/gamer/rechargeConfig/' + configId,
    method: 'delete'
  })
}
