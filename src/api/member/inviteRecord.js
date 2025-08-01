import request from '@/utils/request'

// 查询邀请记录列表
export function listInviteRecord(query) {
  return request({
    url: '/member/inviteRecord/list',
    method: 'get',
    params: query
  })
}

// 查询邀请记录详细
export function getInviteRecord(recordId) {
  return request({
    url: '/member/inviteRecord/' + recordId,
    method: 'get'
  })
}

// 新增邀请记录
export function addInviteRecord(data) {
  return request({
    url: '/member/inviteRecord/add',
    method: 'post',
    data: data
  })
}

// 修改邀请记录
export function updateInviteRecord(data) {
  return request({
    url: '/member/inviteRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除邀请记录
export function delInviteRecord(recordId) {
  return request({
    url: '/member/inviteRecord/' + recordId,
    method: 'delete'
  })
}
