import request from '@/utils/request'

// 查询健身卡列表
export function listCard(query) {
  return request({
    url: '/system/card/list',
    method: 'get',
    params: query
  })
}

// 查询健身卡详细
export function getCard(collegeId) {
  return request({
    url: '/system/card/' + collegeId,
    method: 'get'
  })
}

// 新增健身卡
export function addCard(data) {
  return request({
    url: '/system/card',
    method: 'post',
    data: data
  })
}

// 修改健身卡
export function updateCard(data) {
  return request({
    url: '/system/card',
    method: 'put',
    data: data
  })
}

// 删除健身卡
export function delCard(collegeIds) {
  return request({
    url: '/system/card/' + collegeIds,
    method: 'delete'
  })
}
