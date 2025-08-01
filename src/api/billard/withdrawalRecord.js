import request from '@/utils/request'

// 查询提现记录列表
export function listWithdrawalRecord(query) {
  return request({
    url: '/gamer/withdrawalRecord/list',
    method: 'get',
    params: query
  })
}

// 查询提现记录详细
export function getWithdrawalRecord(recordId) {
  return request({
    url: '/gamer/withdrawalRecord/' + recordId,
    method: 'get'
  })
}

// 新增提现记录
export function addWithdrawalRecord(data) {
  return request({
    url: '/gamer/withdrawalRecord/add',
    method: 'post',
    data: data
  })
}

// 修改提现记录
export function updateWithdrawalRecord(data) {
  return request({
    url: '/gamer/withdrawalRecord/edit',
    method: 'put',
    data: data
  })
}

// 审核提现记录
export function auditWithdrawalRecord(data) {
  return request({
    url: '/gamer/withdrawalRecord/audit',
    method: 'put',
    data: data
  })
}

// 删除提现记录
export function delWithdrawalRecord(recordId) {
  return request({
    url: '/gamer/withdrawalRecord/' + recordId,
    method: 'delete'
  })
}
