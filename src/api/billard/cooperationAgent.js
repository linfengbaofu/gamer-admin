import request from '@/utils/request'

// 查询合营代理列表
export function listCooperationAgent(query) {
  return request({
    url: '/gamer/cooperationAgent/list',
    method: 'get',
    params: query
  })
}

// 查询合营代理详细
export function getCooperationAgent(agentId) {
  return request({
    url: '/gamer/cooperationAgent/' + agentId,
    method: 'get'
  })
}

// 新增合营代理
export function addCooperationAgent(data) {
  return request({
    url: '/gamer/cooperationAgent/add',
    method: 'post',
    data: data
  })
}

// 修改合营代理
export function updateCooperationAgent(data) {
  return request({
    url: '/gamer/cooperationAgent/edit',
    method: 'put',
    data: data
  })
}

// 删除合营代理
export function delCooperationAgent(agentId) {
  return request({
    url: '/gamer/cooperationAgent/' + agentId,
    method: 'delete'
  })
}
