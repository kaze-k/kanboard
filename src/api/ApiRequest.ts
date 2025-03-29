import { Result } from "#/api"
import useUserStore from "@/stores/userStore"
import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios"
import { toast } from "sonner"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 50000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
})

// 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useUserStore.getState().userToken
    // 在请求被发送之前做些什么
    config.headers.Authorization = `Token:${accessToken}`
    return config
  },
  (error) => {
    // 请求错误时做些什么
    return Promise.reject(error)
  },
)

// 响应拦截
axiosInstance.interceptors.response.use(
  (res: AxiosResponse<Result>) => {
    if (res.headers.token) {
      useUserStore.getState().action.setUserToken({ accessToken: res.headers.token })
    }

    if (!res.data) throw new Error("数据不存在")

    const { code, data, message } = res.data
    // 业务请求成功
    if (code === 0) {
      if (message) {
        toast.success(message, {
          position: "top-center",
        })
      }
      return data
    }

    // 业务请求错误
    throw new Error(message || "Error")
  },
  (error: AxiosError<Result>) => {
    const { response, message } = error || {}

    const errMsg = response?.data?.message || message || "Error"
    toast.error(errMsg, {
      position: "top-center",
    })

    const status = response?.status
    if (status === 401) {
      localStorage.clear()
      window.location.replace("/login")
    }

    if (status === 404) {
      window.location.replace("/404")
    }
    return Promise.reject(error)
  },
)

class ApiRequest {
  get<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "GET" })
  }

  post<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "POST" })
  }

  put<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "PUT" })
  }

  delete<T = any>(config: AxiosRequestConfig): Promise<T> {
    return this.request({ ...config, method: "DELETE" })
  }

  request<T = any>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      axiosInstance
        .request<any, AxiosResponse<Result>>(config)
        .then((res: AxiosResponse<Result>) => {
          resolve(res as unknown as Promise<T>)
        })
        .catch((e: Error | AxiosError<Result>) => {
          reject(e)
        })
    })
  }
}

export default new ApiRequest()
