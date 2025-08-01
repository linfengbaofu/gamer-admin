import request from '@/utils/request'

// 查询充值记录列表
export function listRechargeRecord(query) {
  return request({
    url: '/gamer/rechargeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询充值记录详细
export function getRechargeRecord(recordId) {
  return request({
    url: '/gamer/rechargeRecord/' + recordId,
    method: 'get'
  })
}

// 新增充值记录
export function addRechargeRecord(data) {
  return request({
    url: '/gamer/rechargeRecord/add',
    method: 'post',
    data: data
  })
}

// 修改充值记录
  export function updateRechargeRecord(data) {
    return request({
      url: '/gamer/rechargeRecord/edit',
      method: 'put',
      data: data
    })
  }
// 审核充值记录
export function auditRechargeRecord(data) {
  return request({
    url: '/gamer/rechargeRecord/audit',
    method: 'put',
    data: data
  })
}
// 删除充值记录
export function delRechargeRecord(recordId) {
  return request({
    url: '/gamer/rechargeRecord/' + recordId,
    method: 'delete'
  })
}
