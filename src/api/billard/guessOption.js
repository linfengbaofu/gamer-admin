import request from '@/utils/request'

// 查询竞猜选项列表
export function listGuessOption(query) {
  return request({
    url: '/gamer/guessOption/list',
    method: 'get',
    params: query
  })
}

// 查询竞猜选项详细
export function getGuessOption(optionId) {
  return request({
    url: '/gamer/guessOption/' + optionId,
    method: 'get'
  })
}

// 新增竞猜选项
export function addGuessOption(data) {
  return request({
    url: '/gamer/guessOption/add',
    method: 'post',
    data: data
  })
}

// 修改竞猜选项
export function updateGuessOption(data) {
  return request({
    url: '/gamer/guessOption/edit',
    method: 'put',
    data: data
  })
}

// 删除竞猜选项
export function delGuessOption(optionId) {
  return request({
    url: '/gamer/guessOption/' + optionId,
    method: 'delete'
  })
}
