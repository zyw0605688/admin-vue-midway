import http from '../utils/request';

export const login = async (data) => {
  return http.post("/user/login", data)
}

export const create = async (data) => {
  return http.post("/user/create", data)
}


export const deleteByIds = async (params) => {
  return http.delete("/user/delete", params)
}

export const updateById = async (data) => {
  return http.post("/user/update", data)
}

export const getPageList = async (params) => {
  return http.get("/user/list",params)
}

export const getDetailById = async (params) => {
  return http.get("/user/detail", params)
}
