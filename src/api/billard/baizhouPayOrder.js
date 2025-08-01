import request from '@/utils/request'
import { tansParams } from '@/utils/ruoyi'

// 查询百舟支付请求与响应列表
export function listBaizhouPayOrder(query) {
  return request({
    url: '/gamer/baizhouPayOrder/list',
    method: 'get',
    params: query
  })
}

// 查询百舟支付请求与响应详细
export function getBaizhouPayOrder(payReqId) {
  return request({
    url: '/gamer/baizhouPayOrder/' + payReqId,
    method: 'get'
  })
}

// 新增百舟支付请求与响应
export function addBaizhouPayOrder(data) {
  return request({
    url: '/gamer/baizhouPayOrder/add',
    method: 'post',
    data: data
  })
}

// 修改百舟支付请求与响应
export function updateBaizhouPayOrder(data) {
  return request({
    url: '/gamer/baizhouPayOrder/edit',
    method: 'put',
    data: data
  })
}

// 删除百舟支付请求与响应
export function delBaizhouPayOrder(payReqId) {
  return request({
    url: '/gamer/baizhouPayOrder/' + payReqId,
    method: 'delete'
  })
}

export function notifyBaizhouPayOrder(data) {
  return request({
    url: '/baizhou/notify',
    method: 'post',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
      // 不设置 isToken: false，确保 token 会被自动添加
    },
    transformRequest: [(params) => { return tansParams(params) }],
    data: data
  })
}

