import request from '@/utils/request'

// 查询团队列表
export function listGroup(query) {
  return request({
    url: '/customer/group/list',
    method: 'get',
    params: query
  })
}

// 查询团队详细
export function getGroup(groupId) {
  return request({
    url: '/customer/group/' + groupId,
    method: 'get'
  })
}

// 新增团队
export function addGroup(data) {
  return request({
    url: '/customer/group',
    method: 'post',
    data: data
  })
}

// 修改团队
export function updateGroup(data) {
  return request({
    url: '/customer/group',
    method: 'put',
    data: data
  })
}

// 删除团队
export function delGroup(groupIds) {
  return request({
    url: '/customer/group/' + groupIds,
    method: 'delete'
  })
}

// 获取所有销售人员团队
export function listSalesMan() {
  return request({
    url: '/customer/group/salesMan',
    method: 'get'
  })
}

// 导出团队
export function exportGroup(query) {
  return request({
    url: '/customer/group/export',
    method: 'get',
    params: query
  })
}
