import request from '@/utils/request'

// 查询代理列表
export function listAgent(query) {
  return request({
    url: '/member/agent/list',
    method: 'get',
    params: query
  })
}

// 查询代理详细
export function getAgent(agentId) {
  return request({
    url: '/member/agent/' + agentId,
    method: 'get'
  })
}

// 新增代理
export function addAgent(data) {
  return request({
    url: '/member/agent/add',
    method: 'post',
    data: data
  })
}

// 修改代理
export function updateAgent(data) {
  return request({
    url: '/member/agent/edit',
    method: 'put',
    data: data
  })
}

// 删除代理
export function delAgent(agentId) {
  return request({
    url: '/member/agent/' + agentId,
    method: 'delete'
  })
}
