import request from '@/utils/request'

// 查询邀请配置列表
export function listMbInviteConifg(query) {
  return request({
    url: '/member/mbInviteConifg/list',
    method: 'get',
    params: query
  })
}

// 查询邀请配置详细
export function getMbInviteConifg(configId) {
  return request({
    url: '/member/mbInviteConifg/' + configId,
    method: 'get'
  })
}

// 新增邀请配置
export function addMbInviteConifg(data) {
  return request({
    url: '/member/mbInviteConifg/add',
    method: 'post',
    data: data
  })
}

// 修改邀请配置
export function updateMbInviteConifg(data) {
  return request({
    url: '/member/mbInviteConifg/edit',
    method: 'put',
    data: data
  })
}

// 删除邀请配置
export function delMbInviteConifg(configId) {
  return request({
    url: '/member/mbInviteConifg/' + configId,
    method: 'delete'
  })
}
