import request from '@/utils/request'

// 查询课表列表
export function listTimetable(query) {
  return request({
    url: '/timetable/list',
    method: 'get',
    params: query
  })
}

// 新增课程
export function addTimetable(data) {
  return request({
    url: '/timetable',
    method: 'post',
    data: data
  })
}

// 修改课程
export function updateTimetable(data) {
  return request({
    url: '/timetable',
    method: 'put',
    data: data
  })
}

// 删除课程
export function delTimetable(timetableIds) {
  return request({
    url: '/timetable/' + timetableIds,
    method: 'delete'
  })
}

