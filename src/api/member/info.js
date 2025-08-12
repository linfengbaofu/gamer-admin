import request from '@/utils/request'

// 查询客户信息列表
export function listInfo(query) {
  return request({
    url: '/member/info/list',
    method: 'get',
    params: query
  })
}

// 查询客户信息详细
export function getInfo(mbId) {
  return request({
    url: '/member/info/' + mbId,
    method: 'get'
  })
}

// 新增客户信息
export function addInfo(data) {
  return request({
    url: '/member/info/add',
    method: 'post',
    data: data
  })
}

// 修改客户信息
export function updateInfo(data) {
  return request({
    url: '/member/info/edit',
    method: 'put',
    data: data
  })
}

// 删除客户信息
export function delInfo(mbId) {
  return request({
    url: '/member/info/' + mbId,
    method: 'delete'
  })
}


// 添加积分
export function addPoint(data) {
  return request({
    url: '/member/info/addPoint',
    method: 'post',
    data: data
  })
}

// 积分转账
export function transferPoints(data) {
  return request({
    url: '/member/pointsRecord/transferPoints',
    method: 'post',
    data: data
  })
}

// 修改kyc密码
export function changeKycPw(data) {
  return request({
    url: '/member/info/changeKycPw',
    method: 'post',
    data: data
  })
}
