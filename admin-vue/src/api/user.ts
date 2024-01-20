import request from '../utils/request';

export const login = async (data) => {
  return request.post("/login", data)
}
