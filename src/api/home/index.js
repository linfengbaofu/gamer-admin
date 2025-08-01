import request from '@/utils/request'

// 查询菜单列表
export function statistics() {
  return request({
    url: '/home/statistics',
    method: 'get',
  })
}