import request from '@/utils/request'

// 查询团队成员列表
export function listGroupMember(query) {
  return request({
    url: '/customer/group/member/list',
    method: 'get',
    params: query
  })
}

// 查询团队成员详细
export function getGroupMember(groupMemberId) {
  return request({
    url: '/customer/group/member/' + groupMemberId,
    method: 'get'
  })
}

// 新增团队成员
export function addGroupMember(data) {
  return request({
    url: '/customer/group/member',
    method: 'post',
    data: data
  })
}

// 修改团队成员
export function updateGroupMember(data) {
  return request({
    url: '/customer/group/member',
    method: 'put',
    data: data
  })
}

// 删除团队成员
export function delGroupMember(groupMemberIds) {
  return request({
    url: '/customer/group/member' + groupMemberIds,
    method: 'delete'
  })
}

// 获取所有销售人员
export function listSalesMan() {
  return request({
    url: '/customer/group/salesMan',
    method: 'get'
  })
}

// 导出团队成员
export function exportGroup(query) {
  return request({
    url: '/customer/group/export',
    method: 'get',
    params: query
  })
}
