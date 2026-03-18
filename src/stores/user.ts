import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { login, logout, register, tokenCheck } from '@/api/authorization'
import { TUserResponse } from '@/api/authorization/types'
import toast from '@/components/base/toast/toast'

type TRegisterData = {
  email: string
  password: string
  name: string
}

type TLoginData = {
  email: string
  password: string
}

export const useUserStore = defineStore('user', () => {
  const userData = ref<TUserResponse | null>(null)
  const isAuhtorized = ref(false)
  const isLoading = ref(false)

  const router = useRouter()

  const registerUser = async (data: TRegisterData) => {
    try {
      const res = await register(data.email, data.password, data.name)
      if (res) {
        userData.value = res
        isAuhtorized.value = true
        router.push('/boards')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const loginUser = async (data: TLoginData) => {
    try {
      const res = await login(data.email, data.password)
      if (res) {
        userData.value = res
        isAuhtorized.value = true
        router.push('/boards')
        toast.success('Вход выполнен успешно')
      }
    } catch (e) {
      console.log(e)
      toast.error('Ошибка входа')
    }
  }

  const initialize = async () => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      try {
        const res = await tokenCheck()
        if (res.success) {
          isAuhtorized.value = true
          userData.value = res.data
        }
      } catch (e) {
        console.log(e)
        isAuhtorized.value = false
        router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }

  const logoutUser = async () => {
    try {
      const res = await logout()
      if (res) {
        localStorage.removeItem('auth_token')
        userData.value = null
        isAuhtorized.value = false
        router.push('/login')
      }
    } catch (e) {
      console.log(e)
    }
  }

  return {
    userData,
    isAuhtorized,
    isLoading,
    registerUser,
    loginUser,
    initialize,
    logoutUser,
  }
})
