import axios from 'axios'
//创建axios实例
const request = axios.create({
  baseURL: process.env.VUE_APP_CLIENT_API, // api 的 base_url, 
  timeout: 5000,
})
//请求拦截
request.interceptors.request.use(
    config => {
        if (config.method === 'post'){
            config.data = {
                ...config.data
            }
        }
        config.headers['X-API-Version'] = "v1"
        config.headers['X-Source'] = "web"
        config.headers['X-Request-Time'] = new Date().toISOString() // ISO 8601 格式的日期时间
        config.headers['Authorization'] = `Bearer ${localStorage.getItem("Authorization")}`
        config.headers['content-type'] = "application/json; charset=UTF-8"
      return config
    },
    error => {
      // do something with request error
      return Promise.reject(error)
    }
  )
//响应拦截
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    let message = ''
    const status = error.response.status
    console.log("cw:",error.response.data)
    switch (status) {
      case 400:
        message = error.response.data
        break
      case 401:
        message = 'TOKEN过期'
        break
      case 403:
        message = '无权访问'
        break
      case 404:
        message = '请求地址错误'
        break
      case 500:
        message = '服务器出现问题'
        break
      default:
        message = '网络出现问题'
        break
    }
    //提示错误信息
    //...
    return Promise.reject(error)
  },
)
//对外暴露
export default request