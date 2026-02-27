import { ref } from 'vue'

/**
 * 延迟显示 loading 的 hook
 * 如果请求在指定时间内完成，则不显示 loading
 * @param delay 延迟显示 loading 的时间，默认 1000ms
 */
export function useLoading(delay: number = 1000) {
  const showLoading = ref(false)
  let timer: number | null = null

  const startLoading = () => {
    // 设置延迟显示 loading
    timer = setTimeout(() => {
      showLoading.value = true
    }, delay) as unknown as number
  }

  const stopLoading = () => {
    // 清除定时器
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    // 隐藏 loading
    showLoading.value = false
  }

  return {
    showLoading,
    startLoading,
    stopLoading
  }
}
