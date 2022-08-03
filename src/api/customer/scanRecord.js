import request from '@/utils/request'

// 查询扫码列表
export function listScanRecord(query) {
  return request({
    url: '/scan/record/list',
    method: 'get',
    params: query
  })
}

// 根据用户id获取用户信息
export function getUserById(userId) {
  return request({
    url: '/activate/card/user/'+userId,
    method: 'get'
  })
}

// 查询所有会员卡列表
export function listSysCard(queryParams) {
  return request({
    url: '/activate/card/allCard',
    method: 'get',
    params: queryParams
  })
}

// 新增开卡
export function addActivateCard(data) {
  return request({
    url: '/activate/card',
    method: 'post',
    data: data
  })
}

// 修改开卡
export function updateActivateCard(data) {
  return request({
    url: '/activate/card',
    method: 'put',
    data: data
  })
}

// 查询开卡详细
export function getActivateCard(activateCardId) {
  return request({
    url: '/activate/card/' + activateCardId,
    method: 'get'
  })
}



// 删除开卡
export function delActivateCard(activateCardIds) {
  return request({
    url: '/activate/card/' + activateCardIds,
    method: 'delete'
  })
}






