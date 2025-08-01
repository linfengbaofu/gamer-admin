import request from '@/utils/request'

// 查询台球新闻管理列表
export function listNewsManage(query) {
  return request({
    url: '/member/newsManage/list',
    method: 'get',
    params: query
  })
}

// 查询台球新闻管理详细
export function getNewsManage(newsId) {
  return request({
    url: '/member/newsManage/get/' + newsId,
    method: 'get'
  })
}

// 新增台球新闻管理
export function addNewsManage(data) {
  return request({
    url: '/member/newsManage/add',
    method: 'post',
    data: data
  })
}

// 修改台球新闻管理
export function updateNewsManage(data) {
  return request({
    url: '/member/newsManage/edit',
    method: 'put',
    data: data
  })
}

// 删除台球新闻管理
export function delNewsManage(newsId) {
  return request({
    url: '/member/newsManage/' + newsId,
    method: 'delete'
  })
}
