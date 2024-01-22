import http from '../utils/request';

export const login = async (data) => {
  return http.post("/user/login", data)
}

export const createUser = async (data) => {
  return http.post("/user/create", data)
}


export const deleteUserByIds = async (params) => {
  return http.delete("/user/delete", params)
}

export const updateUserById = async (data) => {
  return http.post("/user/update", data)
}

export const getUserListPage = async (params) => {
  return http.get("/user/list",params)
}

export const getDetailById = async (params) => {
  return http.get("/user/detail", params)
}
