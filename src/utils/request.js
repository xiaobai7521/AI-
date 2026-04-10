import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api', // 请求前缀
  timeout: 5000 // 请求超时时间
})

// 防抖函数，避免短时间内重复显示相同的错误提示
let errorTimer = null
const showError = message => {
  if (errorTimer) {
    clearTimeout(errorTimer)
  }
  errorTimer = setTimeout(() => {
    ElMessage.error(message)
  }, 300)
}

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['token'] = token
    }
    return config
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const { data, config } = response
    if (data.code === '200') {
      return data.data
    } else {
      // 登录接口的错误处理
      if (config.url?.includes('/login')) {
        showError(data.msg || '用户名或密码错误')
        return Promise.reject(data.msg || '登录失败')
      }
      // 其他接口的错误处理
      if (data.code === '-1') {
        showError(data.msg || '登录过期，请重新登录')

        // 清除掉登录信息
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
        window.location.href = '/auth/login'
      } else {
        showError(data.msg || '操作失败')
        return Promise.reject(data.msg || '操作失败')
      }
    }
  },
  error => {
    // 对响应错误做点什么
    // 只在非404和非网络错误时显示提示
    if (error.response && error.response.status !== 404) {
      showError('网络请求失败，请稍后重试')
    }
    return Promise.reject(error)
  }
)

export default service
