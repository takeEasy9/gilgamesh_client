/* eslint-disable ts/no-unsafe-argument */
/* eslint-disable ts/no-unsafe-member-access */
/* eslint-disable ts/no-unsafe-assignment */
import router from '@/router';
import axios, { type AxiosInstance, type AxiosInterceptorOptions, type AxiosRequestConfig, type AxiosResponse, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios';
import { ElMessage } from 'element-plus';

// 接口响应格式
export interface ApiResult<T = any> {
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
// 请求默认超时时间, 单位毫秒
export const DEFALUT_TIME_OUT = 5000;

// axios 拦截器
export interface AxiosInterceptor<V = any> {
  // 处理成功的逻辑
  onFulfilled?: ((value: V) => V | Promise<V>) | null;
  // 处理失败的逻辑
  onRejected?: ((error: any) => any) | null;
  // 拦截器配置
  options?: AxiosInterceptorOptions;
}

// axios xhr 请求
export default class AxiosRequest {
  // axios 实例
  instance: AxiosInstance;
  // 基础配置 超时时间
  baseConfig: AxiosRequestConfig = { timeout: DEFALUT_TIME_OUT };
  // 默认请求拦截器
  defaultRequestInterceptor: AxiosInterceptor = {
    onFulfilled: (config: InternalAxiosRequestConfig) => {
      // todo 添加token
      return config;
    },
    onRejected: async (error: any) => {
      // 请求错误，这里可以用全局提示框进行提示
      return Promise.reject(error);
    },
  };

  // 默认响应拦截器
  defaultResponseInterceptor: AxiosInterceptor = {
    onFulfilled: (response: AxiosResponse<ApiResult>) => {
      // 直接返回res，当然你也可以只返回res.data
      // 系统如果有自定义code也可以在这里处理
      const data: ApiResult = response.data;
      return data;
    },
    onRejected: async (error: any) => {
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
  };

  constructor(config: AxiosRequestConfig, requestInterceptor?: AxiosInterceptor, responseInterceptor?: AxiosInterceptor) {
    // 创建axios对象
    this.instance = axios.create(Object.assign(this.baseConfig, config));
    requestInterceptor = requestInterceptor ?? this.defaultRequestInterceptor;
    // 设置请求拦截器
    this.instance.interceptors.request.use(
      requestInterceptor.onFulfilled ?? this.defaultRequestInterceptor.onFulfilled,
      requestInterceptor.onRejected ?? this.defaultRequestInterceptor.onRejected,
      requestInterceptor.options ?? this.defaultRequestInterceptor.options,
    );
    // 设置响应拦截器
    responseInterceptor = responseInterceptor ?? this.defaultResponseInterceptor;
    this.instance.interceptors.response.use(responseInterceptor.onFulfilled ?? this.defaultResponseInterceptor.onFulfilled, responseInterceptor.onRejected ?? this.defaultResponseInterceptor.onRejected, responseInterceptor.options ?? this.defaultResponseInterceptor.options);
  }

  // 定义请求方法
  public async request(config: AxiosRequestConfig): Promise<AxiosResponse> {
    return this.instance.request(config);
  }

  public async get<T = any>(
    url: string,
    config?: Omit<AxiosRequestConfig, 'url'>,
  ): Promise<ApiResult<T>> {
    return this.instance.get(url, config);
  }

  public async post<T = any>(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'data'>,
  ): Promise<ApiResult<T>> {
    return this.instance.post(url, data, config);
  }

  public async put<T = any>(
    url: string,
    data?: any,
    config?: Omit<AxiosRequestConfig, 'url' | 'data'>,
  ): Promise<ApiResult<T>> {
    return this.instance.put(url, data, config);
  }

  public async delete<T = any>(
    url: string,
    config?: Omit<AxiosRequestConfig, 'url'>,
  ): Promise<ApiResult<T>> {
    return this.instance.delete(url, config);
  }
}
