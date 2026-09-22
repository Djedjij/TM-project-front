import axios from 'axios'
import { apiGet, apiPost } from '../client'
import { TInitializeResponse, TRefreshTokenResponse, TUserResponse } from './types'

export const register = async (email: string, password: string, name: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/register`,
    {
      email,
      password,
      name,
    },
    { withCredentials: true },
  )

  const { accessToken, user } = res.data.data
  localStorage.setItem('auth_token', accessToken)
  return user
}

export const login = async (email: string, password: string) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_URL}/auth/login`,
    {
      email,
      password,
    },
    { withCredentials: true },
  )

  const { accessToken, user } = res.data.data
  localStorage.setItem('auth_token', accessToken)
  return user
}

export const tokenCheck = async () => {
  return await apiGet<TInitializeResponse>('/auth/me')
}

export const refreshToken = async (): Promise<TRefreshTokenResponse> => {
  const { data } = await axios.post<TRefreshTokenResponse>(
    `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
    {},
    { withCredentials: true },
  )
  return data
}

export const logout = async () => {
  return await apiPost('/auth/logout')
}
