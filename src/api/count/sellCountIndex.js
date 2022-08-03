import request from '@/utils/request'

// 查询开卡列表
export function listUser(query) {
  return request({
    url: '/statistics/sale/list',
    method: 'get',
    params: query
  })
}
