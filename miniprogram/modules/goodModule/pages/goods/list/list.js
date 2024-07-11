import { reqGetGoodList } from '../../../../../API/goods'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [], // 商品列表数据
    total: 0,
    isLoading: false,
    // 商品列表的请求参数
    requestData: {
      page: 1,
      limit: 10,
      category1Id: '',
      category2Id: ''
    }
  },
  async getGoodInfoList() {
    this.data.isLoading = true
    const res = await reqGetGoodList(this.data.requestData)
    this.data.isLoading = false
    const { records, total } = res.data
    this.setData({
      goodsList: [...this.data.goodsList, ...records],
      total: total
    })
  },
  onLoad(option) {
    Object.assign(this.data.requestData, option)
    this.getGoodInfoList()
  },
  onReachBottom() {
    if(this.data.isLoading) return
    if (Math.ceil(this.data.total / this.data.requestData.limit) > this.data.requestData.page) {
      this.setData({
        'requestData.page': this.data.requestData.page + 1
      })
      this.getGoodInfoList()
    }
  },
  onPullDownRefresh() {
    //重置数据
    this.setData({
      goodsList: [],
      total: 0,
      requestData: Object.assign({ ...this.data.requestData, page: 1, limit: 10 })
    })
    //重新发请求
    this.getGoodInfoList(this.data.requestData)
    //关闭下拉刷新
    wx.stopPullDownRefresh()
  }
})
//此处可以做个节流，当突然刷新多次的时候只响应一次，可以设置一个flag，当发送请求数据时，flag由false改为true，请求数据回来之后true改为false，false表示不请求数据。
