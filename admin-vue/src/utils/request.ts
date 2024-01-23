import axios, {AxiosInstance, AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = JSON.parse(localStorage.getItem("token"))
    if (token && token.length) {
      config.headers.authorization = "Bearer " + token
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject();
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.status === 200) {
      return response.data;
    } else {
      Promise.reject();
    }
  },
  (error: AxiosError) => {
    console.log(error);
    return Promise.reject();
  }
);

const http = {
  get(url, params) {
    return new Promise((resolve, reject) => {
      service.get(url, {params: params})
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
  post(url, data) {
    return new Promise((resolve, reject) => {
      service.post(url, data)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
  delete(url, params) {
    return new Promise((resolve, reject) => {
      service.delete(url, {params: params})
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err.data);
        });
    });
  },
};
export default http;
