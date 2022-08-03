import request from '@/utils/request'

// 查询课程列表
export function listCurriculum(query) {
  return request({
    url: '/curriculum/list',
    method: 'get',
    params: query
  })
}

// 新增课程
export function addCurriculum(data) {
  return request({
    url: '/curriculum',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateCurriculum(data) {
  return request({
    url: '/curriculum',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delCurriculum(curriculumIds) {
  return request({
    url: '/curriculum/' + curriculumIds,
    method: 'delete'
  })
}

