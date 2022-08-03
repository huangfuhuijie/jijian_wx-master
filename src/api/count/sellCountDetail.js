import request from '@/utils/request'

// 查询开卡列表
export function listCustomer(query) {
  return request({
    url: '/statistics/sale',
    method: 'get',
    params: query
  })
}
