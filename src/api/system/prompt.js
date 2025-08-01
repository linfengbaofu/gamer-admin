import request from '@/utils/request'

// 查询弹窗消息列表
export function listPrompt(query) {
  return request({
    url: '/system/prompt/list',
    method: 'get',
    params: query
  })
}

// 查询弹窗消息详细
export function getPrompt(promptId) {
  return request({
    url: '/system/prompt/' + promptId,
    method: 'get'
  })
}

// 新增弹窗消息
export function addPrompt(data) {
  return request({
    url: '/system/prompt/add',
    method: 'post',
    data: data
  })
}

// 修改弹窗消息
export function updatePrompt(data) {
  return request({
    url: '/system/prompt/edit',
    method: 'put',
    data: data
  })
}

// 删除弹窗消息
export function delPrompt(promptId) {
  return request({
    url: '/system/prompt/' + promptId,
    method: 'delete'
  })
}
