import request from '@/utils/request'

// 查询百舟支付异步通知列表
export function listBaizhouPayNotify(query) {
  return request({
    url: '/gamer/baizhouPayNotify/list',
    method: 'get',
    params: query
  })
}

// 查询百舟支付异步通知详细
export function getBaizhouPayNotify(notifyId) {
  return request({
    url: '/gamer/baizhouPayNotify/' + notifyId,
    method: 'get'
  })
}

// 新增百舟支付异步通知
export function addBaizhouPayNotify(data) {
  return request({
    url: '/gamer/baizhouPayNotify/add',
    method: 'post',
    data: data
  })
}

// 修改百舟支付异步通知
export function updateBaizhouPayNotify(data) {
  return request({
    url: '/gamer/baizhouPayNotify/edit',
    method: 'put',
    data: data
  })
}

// 删除百舟支付异步通知
export function delBaizhouPayNotify(notifyId) {
  return request({
    url: '/gamer/baizhouPayNotify/' + notifyId,
    method: 'delete'
  })
}
