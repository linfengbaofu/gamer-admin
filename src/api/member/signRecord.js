import request from '@/utils/request'

// 查询签到记录列表
export function listSignRecord(query) {
  return request({
    url: '/member/signRecord/list',
    method: 'get',
    params: query
  })
}

// 查询签到记录详细
export function getSignRecord(recordId) {
  return request({
    url: '/member/signRecord/' + recordId,
    method: 'get'
  })
}

// 新增签到记录
export function addSignRecord(data) {
  return request({
    url: '/member/signRecord/add',
    method: 'post',
    data: data
  })
}

// 修改签到记录
export function updateSignRecord(data) {
  return request({
    url: '/member/signRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除签到记录
export function delSignRecord(recordId) {
  return request({
    url: '/member/signRecord/' + recordId,
    method: 'delete'
  })
}
