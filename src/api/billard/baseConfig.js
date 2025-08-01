import request from '@/utils/request'

// 查询基础配置列表
export function listBaseConfig(query) {
  return request({
    url: '/gamer/baseConfig/list',
    method: 'get',
    params: query
  })
}
// 查询基础配置详细
export function getBaseConfig(data) {
  return request({
    url: '/gamer/baseConfig/getById',
    method: 'get'
  })
}

// 新增基础配置
export function addBaseConfig(data) {
  return request({
    url: '/gamer/baseConfig/add',
    method: 'post',
    data: data
  })
}

// 修改基础配置
export function updateBaseConfig(data) {
  return request({
    url: '/gamer/baseConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除基础配置
export function delBaseConfig(configId) {
  return request({
    url: '/gamer/baseConfig/' + configId,
    method: 'delete'
  })
}
