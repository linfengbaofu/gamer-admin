import request from '@/utils/request'

// 查询辅助展示内容列表
export function listAide(query) {
  return request({
    url: '/system/aide/list',
    method: 'get',
    params: query
  })
}

// 查询辅助展示内容详细
export function getAide(aideId) {
  return request({
    url: '/system/aide/' + aideId,
    method: 'get'
  })
}

// 新增辅助展示内容
export function addAide(data) {
  return request({
    url: '/system/aide/add',
    method: 'post',
    data: data
  })
}

// 修改辅助展示内容
export function updateAide(data) {
  return request({
    url: '/system/aide/edit',
    method: 'put',
    data: data
  })
}

// 删除辅助展示内容
export function delAide(aideId) {
  return request({
    url: '/system/aide/' + aideId,
    method: 'delete'
  })
}
