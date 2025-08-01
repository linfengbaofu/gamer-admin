import request from '@/utils/request'

// 查询竞猜列表
export function listGuess(query) {
  return request({
    url: '/gamer/guess/list',
    method: 'get',
    params: query
  })
}

// 查询竞猜详细
export function getGuess(guessId) {
  return request({
    url: '/gamer/guess/' + guessId,
    method: 'get'
  })
}

// 新增竞猜
export function addGuess(data) {
  return request({
    url: '/gamer/guess/add',
    method: 'post',
    data: data
  })
}

// 修改竞猜
export function updateGuess(data) {
  return request({
    url: '/gamer/guess/edit',
    method: 'put',
    data: data
  })
}

// 删除竞猜
export function delGuess(guessId) {
  return request({
    url: '/gamer/guess/' + guessId,
    method: 'delete'
  })
}
export function setWinOption(data) {
  return request({
    url: '/gamer/guess/setWinOption',
    method: 'put',
    data: data
  })
}
export function stopBet(data) {
  return request({
    url: '/gamer/guess/stopBet',
    method: 'put',
    data: data
  })
}

