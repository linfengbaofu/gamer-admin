import request from '@/utils/request'

// 查询玩家rpt调控列表
export function listMbRtpConfig(query) {
  return request({
    url: '/member/MbRtpConfig/list',
    method: 'get',
    params: query
  })
}

// 查询玩家rpt调控详细
export function getMbRtpConfig(id) {
  return request({
    url: '/member/MbRtpConfig/' + id,
    method: 'get'
  })
}

// 新增玩家rpt调控
export function addMbRtpConfig(data) {
  return request({
    url: '/member/MbRtpConfig/add',
    method: 'post',
    data: data
  })
}

// 修改玩家rpt调控
export function updateMbRtpConfig(data) {
  return request({
    url: '/member/MbRtpConfig/edit',
    method: 'put',
    data: data
  })
}

// 删除玩家rpt调控
export function delMbRtpConfig(id) {
  return request({
    url: '/member/MbRtpConfig/' + id,
    method: 'delete'
  })
}
