// import { toast } from './utils/extendApi'
import './utils/extendApi'
import { setstorage, asyncsetstorage, getstorage, asyncgetstorage, removestorage, asyncremovestorage, clearstorage, asyncclearstorage } from './utils/storage'
App({
  //定义全局数据，用于页面间的通信
  globalData:{
    address:{}
  },
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function () {},

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: async function (options) {
    // 只要下面的函数是异步函数，都需要async
    // toast()
    // wx.toast({ title: '天生我才' })
    // const p = await wx.modal()
    // wx.modal()执行返回的是一个promise，因此需要await
    // console.log(p)
    // p.then((res) => {
    //   console.log(res)
    // })
    // setstorage('name', 'mike')
    // asyncsetstorage('school', 'jack').then((res) => {
    //   console.log(res)
    // })
    // asyncgetstorage('school').then((res) => {
    //   console.log(res)
    // })
    // removestorage('school')
    const AccountInfo = wx.getAccountInfoSync()
    // console.log(AccountInfo)
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {},

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {}
})
