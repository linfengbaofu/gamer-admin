import request from '@/utils/request'

// 查询充值提现配置列表
export function listFinanceConfig(query) {
  return request({
    url: '/member/financeConfig/list',
    method: 'get',
    params: query
  })
}

// 查询充值提现配置详细
export function getFinanceConfig(assetsId) {
  return request({
    url: '/member/financeConfig/' + assetsId,
    method: 'get'
  })
}

// 新增充值提现配置
export function addFinanceConfig(data) {
  return request({
    url: '/member/financeConfig/add',
    method: 'post',
    data: data
  })
}

// 修改充值提现配置
export function updateFinanceConfig(data) {
  return request({
    url: '/member/financeConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除充值提现配置
export function delFinanceConfig(assetsId) {
  return request({
    url: '/member/financeConfig/' + assetsId,
    method: 'delete'
  })
}
