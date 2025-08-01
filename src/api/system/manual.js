import request from '@/utils/request'

// 查询玩法说明列表
export function listManual(query) {
  return request({
    url: '/system/manual/list',
    method: 'get',
    params: query
  })
}

// 查询玩法说明详细
export function getManual(id) {
  return request({
    url: '/system/manual/' + id,
    method: 'get'
  })
}

// 新增玩法说明
export function addManual(data) {
  return request({
    url: '/system/manual/add',
    method: 'post',
    data: data
  })
}

// 修改玩法说明
export function updateManual(data) {
  return request({
    url: '/system/manual/edit',
    method: 'put',
    data: data
  })
}

// 删除玩法说明
export function delManual(id) {
  return request({
    url: '/system/manual/' + id,
    method: 'delete'
  })
}
