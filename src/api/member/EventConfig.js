import request from '@/utils/request'

// 查询活动配置列表
export function listEventConfig(query) {
  return request({
    url: '/member/EventConfig/list',
    method: 'get',
    params: query
  })
}

// 查询活动配置详细
export function getEventConfig(id) {
  return request({
    url: '/member/EventConfig/' + id,
    method: 'get'
  })
}

// 新增活动配置
export function addEventConfig(data) {
  return request({
    url: '/member/EventConfig/add',
    method: 'post',
    data: data
  })
}

// 修改活动配置
export function updateEventConfig(data) {
  return request({
    url: '/member/EventConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除活动配置
export function delEventConfig(id) {
  return request({
    url: '/member/EventConfig/' + id,
    method: 'delete'
  })
}
