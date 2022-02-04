import axios from 'axios';
import {BASH_URI} from './pathMap';
import Toast from './toast';
import RootStore from '../mobx/index';
const service = axios.create({
  baseURL: BASH_URI,
  timeout: 1000 * 5,
});

// Add a request interceptor
service.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    Toast.showLoading('请求中');
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
service.interceptors.response.use(
  function (response) {
    Toast.hideLoading();
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    Toast.hideLoading();
    return Promise.reject(error);
  },
);

export default {
  get: service.get,
  post: service.post,
  privatePost: (url, data = {}, options = {}) => {
    return service.post(url, data, {
      ...options,
      headers: {
        Authorization: `Bearer ${RootStore.token}`,
        ...options.headers,
      },
    });
  },
  privateGet: (url, data = {}, options = {}) => {
    return service.get(url, {
      ...options,
      params: data,
      headers: {
        Authorization: `Bearer ${RootStore.token}`,
        ...options.headers,
      },
    });
  },
};
