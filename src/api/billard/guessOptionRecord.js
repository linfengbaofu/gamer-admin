import request from '@/utils/request'

// 查询竞猜选项审批列表
export function listGuessOptionRecord(query) {
  return request({
    url: '/gamer/guessOptionRecord/list',
    method: 'get',
    params: query
  })
}

// 查询竞猜选项审批详细
export function getGuessOptionRecord(optionRecordId) {
  return request({
    url: '/gamer/guessOptionRecord/' + optionRecordId,
    method: 'get'
  })
}

// 新增竞猜选项审批
export function addGuessOptionRecord(data) {
  return request({
    url: '/gamer/guessOptionRecord/add',
    method: 'post',
    data: data
  })
}

// 修改竞猜选项审批
export function updateGuessOptionRecord(data) {
  return request({
    url: '/gamer/guessOptionRecord/edit',
    method: 'put',
    data: data
  })
}

// 删除竞猜选项审批
export function delGuessOptionRecord(optionRecordId) {
  return request({
    url: '/gamer/guessOptionRecord/' + optionRecordId,
    method: 'delete'
  })
}
