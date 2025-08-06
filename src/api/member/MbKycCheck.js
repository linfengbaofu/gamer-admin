import request from '@/utils/request'

// 查询KYC认证列表
export function listMbKycCheck(query) {
  return request({
    url: '/member/MbKycCheck/list',
    method: 'get',
    params: query
  })
}

// 查询KYC认证详细
export function getMbKycCheck(id) {
  return request({
    url: '/member/MbKycCheck/' + id,
    method: 'get'
  })
}

// 新增KYC认证
export function addMbKycCheck(data) {
  return request({
    url: '/member/MbKycCheck/add',
    method: 'post',
    data: data
  })
}

// 修改KYC认证
export function updateMbKycCheck(data) {
  return request({
    url: '/member/MbKycCheck/edit',
    method: 'put',
    data: data
  })
}

// 删除KYC认证
export function delMbKycCheck(id) {
  return request({
    url: '/member/MbKycCheck/' + id,
    method: 'delete'
  })
}

// 审核KYC认证
export function checkMbKycCheck(data) {
  return request({
    url: '/member/MbKycCheck/check',
    method: 'post',
    data: data
  })
}
