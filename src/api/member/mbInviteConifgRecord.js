import request from '@/utils/request'

// 查询会员领取配置列表
export function listMbInviteConifgRecord(query) {
  return request({
    url: '/member/mbInviteConifgRecord/list',
    method: 'get',
    params: query
  })
}

// 查询会员领取配置详细
export function getMbInviteConifgRecord(recordId) {
  return request({
    url: '/member/mbInviteConifgRecord/' + recordId,
    method: 'get'
  })
}

// 新增会员领取配置
export function addMbInviteConifgRecord(data) {
  return request({
    url: '/member/mbInviteConifgRecord/add',
    method: 'post',
    data: data
  })
}

// 修改会员领取配置
export function updateMbInviteConifgRecord(data) {
  return request({
    url: '/member/mbInviteConifgRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除会员领取配置
export function delMbInviteConifgRecord(recordId) {
  return request({
    url: '/member/mbInviteConifgRecord/' + recordId,
    method: 'delete'
  })
}
