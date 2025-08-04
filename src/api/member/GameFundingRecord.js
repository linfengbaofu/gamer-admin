import request from '@/utils/request'

// 查询资金记录列表
export function listGameFundingRecord(query) {
  return request({
    url: '/member/GameFundingRecord/list',
    method: 'get',
    params: query
  })
}

// 查询资金记录详细
export function getGameFundingRecord(recordId) {
  return request({
    url: '/member/GameFundingRecord/' + recordId,
    method: 'get'
  })
}

// 新增资金记录
export function addGameFundingRecord(data) {
  return request({
    url: '/member/GameFundingRecord/add',
    method: 'post',
    data: data
  })
}

// 修改资金记录
export function updateGameFundingRecord(data) {
  return request({
    url: '/member/GameFundingRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除资金记录
export function delGameFundingRecord(recordId) {
  return request({
    url: '/member/GameFundingRecord/' + recordId,
    method: 'delete'
  })
}
