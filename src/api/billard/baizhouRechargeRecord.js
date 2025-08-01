import request from '@/utils/request'

// 查询百州充值记录列表
export function listBaizhouRechargeRecord(query) {
  return request({
    url: '/gamer/baizhouRechargeRecord/list',
    method: 'get',
    params: query
  })
}

// 查询百州充值记录详细
export function getBaizhouRechargeRecord(recordId) {
  return request({
    url: '/gamer/baizhouRechargeRecord/' + recordId,
    method: 'get'
  })
}

// 新增百州充值记录
export function addBaizhouRechargeRecord(data) {
  return request({
    url: '/gamer/baizhouRechargeRecord/add',
    method: 'post',
    data: data
  })
}

// 修改百州充值记录
export function updateBaizhouRechargeRecord(data) {
  return request({
    url: '/gamer/baizhouRechargeRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除百州充值记录
export function delBaizhouRechargeRecord(recordId) {
  return request({
    url: '/gamer/baizhouRechargeRecord/' + recordId,
    method: 'delete'
  })
}
