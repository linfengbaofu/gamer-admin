import request from '@/utils/request'

// 查询积分流水记录列表
export function listPointsRecord(query) {
  return request({
    url: '/member/pointsRecord/list',
    method: 'get',
    params: query
  })
}

// 查询积分流水记录统计
export function listPointsRecordCount(query) {
  return request({
    url: '/member/pointsRecord/listCount',
    method: 'get',
    params: query
  })
}

// 查询积分流水记录详细
export function getPointsRecord(id) {
  return request({
    url: '/member/pointsRecord/' + id,
    method: 'get'
  })
}

// 新增积分流水记录
export function addPointsRecord(data) {
  return request({
    url: '/member/pointsRecord/add',
    method: 'post',
    data: data
  })
}

// 修改积分流水记录
export function updatePointsRecord(data) {
  return request({
    url: '/member/pointsRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除积分流水记录
export function delPointsRecord(id) {
  return request({
    url: '/member/pointsRecord/' + id,
    method: 'delete'
  })
}
