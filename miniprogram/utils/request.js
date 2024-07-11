/**
 * @param request(object)核心，put,post等方法都是在此基础上完成的
 * @loading的封装，解决三个问题，1、多次并发请求只用显示一个loading
 * 2、只要有一个请求结束就会关闭loading  3、连续请求间的闪烁问题。
 */
class WxRequest {
  //在这部分定义默认的值
  defaults = {
    baseURL: '',
    url: '',
    data: null, //请求参数
    method: 'GET',
    header: {
      'Content-type': 'application/json' //设置数据的交换格式
    },
    timeout: 60000,
    isLoading: true
  }
  interceptors = {
    //设置默认拦截器
    request: (config) => config,
    response: (config) => config
  }
  queue = []
  timeID = ''
  //注意：在实例化对象时传递的参数，会被constructor接受。在类的内部读取属性和方法都需要带有this
  constructor(params) {
    this.defaults = Object.assign({}, this.defaults, params)
  }
  request(options) {
    options.url = this.defaults.baseURL + options.url
    options = { ...this.defaults, ...options }
    //注意先后顺序，调用者的options写在后面，
    //在请求发送之前，调用请求拦截器，修改和新增参数
    this.defaults.isLoading = options.isLoading
    if (this.defaults.isLoading&&options.method !== "UPLOAD") {
      this.timeID && clearTimeout(this.timeID)
      this.queue.length === 0 && wx.showLoading()
      this.queue.push('request')
    }
    options = this.interceptors.request(options)

    return new Promise((resolve, reject) => {
      if (options.method === "UPLOAD"){
        wx.uploadFile({
          options,
          success:(res)=>{
            const mergeRes = Object.assign({},res,{
              config:options,
              isSuccess:true
            })
            resolve(this.interceptors.response(mergeRes))
          },
          fail:(err)=>{
            const mergeErr = Object.assign({},err,{
              config:options,
              isSuccess:false
            })
            reject(this.interceptors.response(mergeErr))

          }
        })
      }else{
        wx.request({
          ...options,
          success: (res) => {
            //在请求结束之后，调用响应拦截器，修改返回的结果,一般需要把传递的参数也返回出来，便于修改和维护
            console.log(this.defaults.isLoading)
            const mergeRes = Object.assign({}, res, { config: options })
            console.log(options)
            resolve(this.interceptors.response(mergeRes))
            //注意，此处的函数都写成箭头函数，箭头函数没有this，需要向外面找
          },
          fail: (err) => {
            const mergeErr = Object.assign({}, err, { config: options })
            reject(this.interceptors.response(mergeErr))
          },
          complete: () => {
            if (this.defaults.isLoading) {
              this.queue.pop()
              this.queue.length === 0 && this.queue.push('request')
              this.timeID = setTimeout(() => {
                this.queue.pop()
                this.queue.length === 0 && wx.hideLoading()
                clearTimeout(this.timeID)
              }, 1)
            }
          }
        })
      }
    })
  }
  //其实就是调用的时候少写方法配置项而已
  get(url, data = {}, config = {}) {
    //核心还是在于调用request
    return this.request(Object.assign({ url, data, method: 'GET' }, config))
  }
  post(url, data = {}, config = {}) {
    return this.request(Object.assign({ url, data, method: 'POST' }, config))
  }
  delete(url, data = {}, config = {}) {
    //核心还是在于调用request
    return this.request(Object.assign({ url, data, method: 'DELETE' }, config))
  }
  put(url, data = {}, config = {}) {
    //核心还是在于调用request
    return this.request(Object.assign({ url: url, data, method: 'PUT' }, config))
    //看清楚url: url, data参数传递的形式
  }
  //封装promise.all方法，用于统一代码的风格,
  all(...options) {
    return Promise.all(options)
  }
  upload(url,filepath,name="file",config={}){
    return this.request(
      Object.assign({url,filepath,name,method:"UPLOAD",config})
    )
  }
}
export default WxRequest
//默认导入，不需要带括号
