import request from '@/utils/request'

// 查询百州支付订单查询记录列表
export function listBaizhouPayQuery(query) {
  return request({
    url: '/gamer/baizhouPayQuery/list',
    method: 'get',
    params: query
  })
}

// 查询百州支付订单查询记录详细
export function getBaizhouPayQuery(queryId) {
  return request({
    url: '/gamer/baizhouPayQuery/' + queryId,
    method: 'get'
  })
}

// 新增百州支付订单查询记录
export function addBaizhouPayQuery(data) {
  return request({
    url: '/gamer/baizhouPayQuery/add',
    method: 'post',
    data: data
  })
}

// 修改百州支付订单查询记录
export function updateBaizhouPayQuery(data) {
  return request({
    url: '/gamer/baizhouPayQuery/edit',
    method: 'put',
    data: data
  })
}

// 删除百州支付订单查询记录
export function delBaizhouPayQuery(queryId) {
  return request({
    url: '/gamer/baizhouPayQuery/' + queryId,
    method: 'delete'
  })
}
