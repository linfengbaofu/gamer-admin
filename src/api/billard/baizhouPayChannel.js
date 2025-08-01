import request from '@/utils/request'

// 查询支付通道列表
export function listBaizhouPayChannel(query) {
  return request({
    url: '/gamer/baizhouPayChannel/list',
    method: 'get',
    params: query
  })
}

// 查询支付通道详细
export function getBaizhouPayChannel(channelId) {
  return request({
    url: '/gamer/baizhouPayChannel/' + channelId,
    method: 'get'
  })
}

// 新增支付通道
export function addBaizhouPayChannel(data) {
  return request({
    url: '/gamer/baizhouPayChannel/add',
    method: 'post',
    data: data
  })
}

// 修改支付通道
export function updateBaizhouPayChannel(data) {
  return request({
    url: '/gamer/baizhouPayChannel/edit',
    method: 'put',
    data: data
  })
}

// 删除支付通道
export function delBaizhouPayChannel(channelId) {
  return request({
    url: '/gamer/baizhouPayChannel/' + channelId,
    method: 'delete'
  })
}
