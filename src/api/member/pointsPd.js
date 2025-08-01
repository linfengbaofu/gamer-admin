import request from '@/utils/request'

// 查询积分商品列表
export function listPointsPd(query) {
  return request({
    url: '/member/pointsPd/list',
    method: 'get',
    params: query
  })
}

// 查询积分商品详细
export function getPointsPd(pdId) {
  return request({
    url: '/member/pointsPd/' + pdId,
    method: 'get'
  })
}

// 新增积分商品
export function addPointsPd(data) {
  return request({
    url: '/member/pointsPd/add',
    method: 'post',
    data: data
  })
}

// 修改积分商品
export function updatePointsPd(data) {
  return request({
    url: '/member/pointsPd/edit',
    method: 'put',
    data: data
  })
}

// 删除积分商品
export function delPointsPd(pdId) {
  return request({
    url: '/member/pointsPd/' + pdId,
    method: 'delete'
  })
}
