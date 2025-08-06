import request from '@/utils/request'

// 查询首充奖励配置列表
export function listRechargeFirstConfig(query) {
  return request({
    url: '/member/RechargeFirstConfig/list',
    method: 'get',
    params: query
  })
}

// 查询首充奖励配置详细
export function getRechargeFirstConfig(id) {
  return request({
    url: '/member/RechargeFirstConfig/' + id,
    method: 'get'
  })
}

// 新增首充奖励配置
export function addRechargeFirstConfig(data) {
  return request({
    url: '/member/RechargeFirstConfig/add',
    method: 'post',
    data: data
  })
}

// 修改首充奖励配置
export function updateRechargeFirstConfig(data) {
  return request({
    url: '/member/RechargeFirstConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除首充奖励配置
export function delRechargeFirstConfig(id) {
  return request({
    url: '/member/RechargeFirstConfig/' + id,
    method: 'delete'
  })
}
