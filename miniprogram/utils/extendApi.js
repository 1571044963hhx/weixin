/**
 * @description 封装提示对话框
 * @param {object} 需要和wx.showToast参数保持一致
 */
const toast = ({ title = '数据加载中', icon = 'none', duration = 2000, mask = true } = {}) => {
  // 解构赋值，和设置默认参数
  wx.showToast({
    title,
    icon,
    duration,
    mask
  })
}
//因此这个一般来说基本不需要返回值，因此不必返回一个promise
/**
 * @description 封装模态对话框
 * @param {object} options与wx.showModal保持一致
 */
const modal = (options = {}) => {
  return new Promise((resolve) => {
    const defaultOpt = { title: '提示', content: '你确定要退出吗？,showCancel:true' }
    const { title, content, showCancel } = Object.assign({}, defaultOpt, options)
    wx.showModal({
      title,
      content,
      showCancel,
      complete({ confirm, cancel }) {
        confirm && resolve(true)
        cancel && resolve(false)
      }
    })
  })
}
//只要是异步的API，包装是都需要返回一个Promise，并通过resolve或者reject传递参数，使用时实例化包装的函数并通过.then方法获取参数实现链式调用。
// wx.toast = toast
// wx.modal = modal
// 挂载到微信全局Api上，使用的时候需要先执行一次才可以
export { toast, modal }
// 按需导入
