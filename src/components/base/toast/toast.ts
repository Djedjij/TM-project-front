type TToastParams = {
  placement?: 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right'
  duration?: number
  showClose?: boolean
}

const BASE_TOAST_PARAMS: TToastParams = {
  placement: 'top-right',
  duration: 3000,
  showClose: true,
}

class Toast {
  success(message: string, params?: TToastParams) {
    ElMessage({
      message,
      type: 'success',
      ...BASE_TOAST_PARAMS,
      ...params,
    })
  }

  error(message: string, params?: TToastParams) {
    ElMessage({
      message,
      type: 'error',
      ...BASE_TOAST_PARAMS,
      ...params,
    })
  }

  info(message: string, params?: TToastParams) {
    ElMessage({
      message,
      type: 'info',
      ...BASE_TOAST_PARAMS,
      ...params,
    })
  }

  warning(message: string, params?: TToastParams) {
    ElMessage({
      message,
      type: 'warning',
      ...BASE_TOAST_PARAMS,
      ...params,
    })
  }
}

const toast = new Toast()

export default toast
