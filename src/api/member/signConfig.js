import request from '@/utils/request'

// 查询签到配置列表
export function listSignConfig(query) {
  return request({
    url: '/member/signConfig/list',
    method: 'get',
    params: query
  })
}

// 查询签到配置详细
export function getSignConfig(configId) {
  return request({
    url: '/member/signConfig/' + configId,
    method: 'get'
  })
}

// 新增签到配置
export function addSignConfig(data) {
  return request({
    url: '/member/signConfig/add',
    method: 'post',
    data: data
  })
}

// 修改签到配置
export function updateSignConfig(data) {
  return request({
    url: '/member/signConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除签到配置
export function delSignConfig(configId) {
  return request({
    url: '/member/signConfig/' + configId,
    method: 'delete'
  })
}
