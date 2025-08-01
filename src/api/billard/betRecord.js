import request from '@/utils/request'

// 查询下注记录列表
export function listBetRecord(query) {
  return request({
    url: '/gamer/betRecord/list',
    method: 'get',
    params: query
  })
}

// 查询下注记录详细
export function getBetRecord(betRecordId) {
  return request({
    url: '/gamer/betRecord/' + betRecordId,
    method: 'get'
  })
}

// 新增下注记录
export function addBetRecord(data) {
  return request({
    url: '/gamer/betRecord/add',
    method: 'post',
    data: data
  })
}

// 修改下注记录
export function updateBetRecord(data) {
  return request({
    url: '/gamer/betRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除下注记录
export function delBetRecord(betRecordId) {
  return request({
    url: '/gamer/betRecord/' + betRecordId,
    method: 'delete'
  })
}
