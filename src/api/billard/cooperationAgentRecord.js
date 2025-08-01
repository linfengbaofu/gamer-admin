import request from '@/utils/request'

// 查询合营代理记录列表
export function listCooperationAgentRecord(query) {
  return request({
    url: '/gamer/cooperationAgentRecord/list',
    method: 'get',
    params: query
  })
}

// 查询合营代理记录详细
export function getCooperationAgentRecord(recordId) {
  return request({
    url: '/gamer/cooperationAgentRecord/' + recordId,
    method: 'get'
  })
}

// 新增合营代理记录
export function addCooperationAgentRecord(data) {
  return request({
    url: '/gamer/cooperationAgentRecord/add',
    method: 'post',
    data: data
  })
}

// 修改合营代理记录
export function updateCooperationAgentRecord(data) {
  return request({
    url: '/gamer/cooperationAgentRecord/edit',
    method: 'put',
    data: data
  })
}
export function auditCooperationAgentRecord(data) {
  return request({
    url: '/gamer/cooperationAgentRecord/audit',
    method: 'put',
    data: data
  })
}
// 删除合营代理记录
export function delCooperationAgentRecord(recordId) {
  return request({
    url: '/gamer/cooperationAgentRecord/' + recordId,
    method: 'delete'
  })
}

