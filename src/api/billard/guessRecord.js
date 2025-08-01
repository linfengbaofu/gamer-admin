import request from '@/utils/request'

// 查询竞猜审批列表
export function listGuessRecord(query) {
  return request({
    url: '/gamer/guessRecord/list',
    method: 'get',
    params: query
  })
}

// 查询竞猜审批详细
export function getGuessRecord(recordId) {
  return request({
    url: '/gamer/guessRecord/' + recordId,
    method: 'get'
  })
}

// 新增竞猜审批
export function addGuessRecord(data) {
  return request({
    url: '/gamer/guessRecord/add',
    method: 'post',
    data: data
  })
}

// 修改竞猜审批
export function updateGuessRecord(data) {
  return request({
    url: '/gamer/guessRecord/edit',
    method: 'put',
    data: data
  })
}
// 竞猜审批
export function auditGuessRecord(data) {
  return request({
    url: '/gamer/guessRecord/audit',
    method: 'put',
    data: data
  })
}
// 删除竞猜审批
export function delGuessRecord(recordId) {
  return request({
    url: '/gamer/guessRecord/' + recordId,
    method: 'delete'
  })
}

// 查询中奖申请列表
export function listWinningApplication(query) {
  return request({
    url: '/gamer/guessRecord/winningApplication/list',
    method: 'get',
    params: query
  })
}
