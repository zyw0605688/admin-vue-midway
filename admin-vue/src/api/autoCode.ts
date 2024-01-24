import http from '../utils/request';

export const createFile = async (data) => {
  return http.post("/autoCode/create", data)
}
