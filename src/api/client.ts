import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from 'axios'

export type { AxiosRequestConfig }

export class ApiError extends Error {
  status?: number
  data?: unknown
  isNetworkError: boolean

  constructor(
    message: string,
    options: { status?: number; data?: unknown; isNetworkError?: boolean } = {},
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.data = options.data
    this.isNetworkError = options.isNetworkError ?? false
  }
}

export const apiClient = axios.create({
  //todo: change url
  baseURL: 'http://localhost:5000',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data } = error.response
      console.error('API Error:', status, data)
      return Promise.reject(new ApiError('API Error', { status, data }))
    }

    if (error.request) {
      console.error('Network Error:', error.request)
      return Promise.reject(new ApiError('Network Error', { isNetworkError: true }))
    }

    console.error('Request Error:', error.message)
    return Promise.reject(new ApiError(error.message))
  },
)

export const apiGet = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.get(url, config)
  return response.data
}

export const apiPost = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.post(url, data, config)
  return response.data
}

export const apiPut = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.put(url, data, config)
  return response.data
}

export const apiDelete = async <T = unknown>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.delete(url, config)
  return response.data
}

export const apiPatch = async <T = unknown>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig,
): Promise<T> => {
  const response: AxiosResponse<T> = await apiClient.patch(url, data, config)
  return response.data
}
