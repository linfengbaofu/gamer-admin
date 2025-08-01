import request from '@/utils/request'

// 查询积分商品记录列表
export function listPointsPdRecord(query) {
  return request({
    url: '/member/pointsPdRecord/list',
    method: 'get',
    params: query
  })
}

// 查询积分商品记录详细
export function getPointsPdRecord(recordId) {
  return request({
    url: '/member/pointsPdRecord/' + recordId,
    method: 'get'
  })
}

// 新增积分商品记录
export function addPointsPdRecord(data) {
  return request({
    url: '/member/pointsPdRecord/add',
    method: 'post',
    data: data
  })
}

// 修改积分商品记录
export function updatePointsPdRecord(data) {
  return request({
    url: '/member/pointsPdRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除积分商品记录
export function delPointsPdRecord(recordId) {
  return request({
    url: '/member/pointsPdRecord/' + recordId,
    method: 'delete'
  })
}
// 修改积分商品记录
export function auditPointsPdRecord(data) {
  return request({
    url: '/member/pointsPdRecord/audit',
    method: 'put',
    data: data
  })
}
