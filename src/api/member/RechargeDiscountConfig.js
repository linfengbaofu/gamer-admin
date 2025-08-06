import request from '@/utils/request'

// 查询充值折扣配置列表
export function listRechargeDiscountConfig(query) {
  return request({
    url: '/member/RechargeDiscountConfig/list',
    method: 'get',
    params: query
  })
}

// 查询充值折扣配置详细
export function getRechargeDiscountConfig(id) {
  return request({
    url: '/member/RechargeDiscountConfig/' + id,
    method: 'get'
  })
}

// 新增充值折扣配置
export function addRechargeDiscountConfig(data) {
  return request({
    url: '/member/RechargeDiscountConfig/add',
    method: 'post',
    data: data
  })
}

// 修改充值折扣配置
export function updateRechargeDiscountConfig(data) {
  return request({
    url: '/member/RechargeDiscountConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除充值折扣配置
export function delRechargeDiscountConfig(id) {
  return request({
    url: '/member/RechargeDiscountConfig/' + id,
    method: 'delete'
  })
}
