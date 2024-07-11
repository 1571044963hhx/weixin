import instance from '../../utils/http'
import { reqIndexData } from '../../API/index'
Page({
  data: {
    bannerList: [],
    categoryList: [],
    activeList: [],
    hotList: [],
    guessList: [],
    isLoading: true
  },
  send() {
    // p.request({
    //   url: '/index/findBanner',
    //   method: 'GET'
    // }).then((res) => {
    //   console.log(res)
    // })
    instance
      .get('/index/findBanner', { name: 'jack' }, { isLoading: false })
      .then((res) => {
        console.log(res)
      })
      .then((res) => {
        console.log(res)
      })
    //对比下面的调用方式，通过返回promise对象实现链式调用防止了回调地狱的风险，还有注意wx.request的函数调用时机。
  },
  send1() {
    wx.request({
      url: 'https://gmall-prod.atguigu.cn/mall-api/index/findBanner',
      method: 'GET',
      success(res) {
        console.log('无论成功还是失败的回调，只要返回了结果就会走success函数', res)
      },
      fail(err) {
        console.log('一般只有网络延迟时才会走失败的回调', err)
      }
    })
  },
  sendall() {
    // const res = await Promise.all([p.get('/index/findBanner'), p.get('/index/findCategory1'), p.get('/index/findBanner')])
    // console.log(res)
    const res = instance.all(
      instance.get('/index/findBanner'),
      //这是调用同一个实例p，因此属性可以叠加，queue里面的request是一样的
      instance.get('/index/findCategory1'),
      instance.get('/index/advertisement'),
      instance.get('/index/findListGoods'),
      instance.get('/index/findRecommendGoods')
    )
  },
  async onLoad() {
    const res = await reqIndexData()
    this.setData({
      bannerList: res[0].data,
      categoryList: res[1].data,
      activeList: res[2].data,
      guessList: res[3].data,
      hotList: res[4].data,
      isLoading: false
    })
  },
  onShareAppMessage() {
    return {
      title: '所有的怦然心动，都是你',
      path: '/pages/index/index'
    }
  },
  
  // 转发到朋友圈功能
  onShareTimeline() {}
})
