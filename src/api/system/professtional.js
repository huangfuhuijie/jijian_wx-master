import request from '@/utils/request'

// 查询专业列表
export function listProfessional(query) {
  return request({
    url: '/system/professional/list',
    method: 'get',
    params: query
  })
}

// 查询专业详情
export function getProfessional(professionalId) {
  return request({
    url: '/system/professional/' + professionalId,
    method: 'get'
  })
}

// 新增专业
export function addProfessional(data) {
  return request({
    url: '/system/professional',
    method: 'post',
    data: data
  })
}

// 修改专业
export function updateProfessional(data) {
  return request({
    url: '/system/professional',
    method: 'put',
    data: data
  })
}

// 删除专业
export function delProfessional(professionalIds) {
  return request({
    url: '/system/professional/' + professionalIds,
    method: 'delete'
  })
}

// 导出专业
export function exportProfessional(query) {
  return request({
    url: '/system/professional/export',
    method: 'get',
    params: query
  })
}
