/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-assignment */
import router from '@/router';
import { createFetch } from '@vueuse/core';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, HttpStatusCode, type Method } from 'axios';
import { ElMessage } from 'element-plus';
import type { useFetch, UseFetchOptions, UseFetchReturn } from '@vueuse/core';

// 接口响应格式
export interface ApiResult<T> {
  /**
   * 响应码
   */
  code: string;
  /**
   * 响应消息
   */
  msg: string;
  /**
   * 数据
   */
  data?: T;
}

export const DEFALUT_TIME_OUT = 5000;
// 创建axios对象
const axiosInstance: AxiosInstance = axios.create({
  // 请求超时时间 5000 ms
  timeout: DEFALUT_TIME_OUT,
});
// 请求拦截器
axiosInstance.interceptors.request.use((config) => {
  // todo 统一在http请求的header都加上token
  return config;
}, async (error) => {
  return Promise.reject(error);
});
// 响应拦截器
axiosInstance.interceptors.response.use(
  response => response,
  async (error) => {
    const rejectPromise = Promise.reject(error);
    // 请求已取消
    if (axios.isCancel(error)) {
      return rejectPromise;
    }
    const statusCode = error.response?.status;
    if (statusCode != null) {
      return rejectPromise;
    }
    switch (statusCode) {
      // 401: 未登录
      case axios.HttpStatusCode.Unauthorized:
        await router.replace({
          path: '/login',
          query: { redirect: router.currentRoute.value.fullPath },
        });
        break;
        // 403 token过期
      case HttpStatusCode.Forbidden:
        // todo 清除token 跳转登陆页面
        break;
        // 404请求不存在
      case HttpStatusCode.NotFound:
        // todo
        break;
        // 服务器未知异常
      case HttpStatusCode.InternalServerError:
        // todo
        break;
      default:
        if (error.message != null) {
          ElMessage.error(error.message);
        }
        else {
          ElMessage.error('网络请求错误');
        }
        return rejectPromise;
    }
  },
);

type UseFetchType = typeof useFetch;
const useFetchInstance: UseFetchType = createFetch({
  combination: 'chain',
  options: {
    immediate: false,
    timeout: DEFALUT_TIME_OUT,
    async beforeFetch({ options }) {
      const headers = new Headers(options.headers || {});
      // todo 设置 token
      headers.set('Content-Type', 'application/json');
      options.headers = headers;

      return { options };
    },
    async afterFetch(ctx) {
      const result = await ctx.response.json();
      ctx.data = result;
      return ctx;
    },
  },
});

interface RequestConfig {
  baseURL?: string;
  timeout?: number;
}

async function xhrRequest<T, D>(method: Method, url: string, params?: D, options?: RequestConfig): Promise<ApiResult<T>> {
  if (url != null || url === '') {
    throw new Error('请求url不能为空');
  }
  const config: AxiosRequestConfig<D> = {
    method,
    url,
    ...options,
  };
  // post和put使用json格式传参
  if (method === 'post' || method === 'put' || method === 'POST' || method === 'PUT') {
    config.data = params;
  }
  else {
    config.params = params;
  }
  return axiosInstance
    .request<ApiResult<T>>(config)
    .then(async (response) => {
      // 获取请求返回结果
      const result: ApiResult<T> = response.data;
      return apiResultHandler(result);
    })
    .catch(async (e) => {
      return Promise.reject(e);
    });
}

async function apiResultHandler<T>(result: ApiResult<T>): Promise<T | undefined> {
  if (result.code === '1401') {
    return result.data;
  }
  return Promise.reject(result);
}
