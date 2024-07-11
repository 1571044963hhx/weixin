import { reqGetGoodInfo } from '../../../../../API/goods'
import { userBehavior } from '@/behavior/userBehavior'
import { reqAddCart, reqGetCartList } from '@/API/cart'
import { toast } from '@/utils/extendApi'
Page({
  behaviors: [userBehavior],
  // 页面的初始数据
  data: {
    goodsInfo: {}, // 商品详情
    show: false, // 控制加入购物车和立即购买弹框的显示
    count: 1, // 商品购买数量，默认是 1
    blessing: '', // 祝福语
    buyNow: 0, //0表示加入购物车，1立即购买
    allCount: 0
  },
  //点击预览图片
  prewiewImage() {
    wx.previewImage({
      urls: this.data.goodsInfo.detailList
    })
  },

  //渲染数据
  async getGoodInfo() {
    const res = await reqGetGoodInfo(this.ID)
    this.setData({
      goodsInfo: res.data
    })
  },

  // 加入购物车
  handleAddcart() {
    this.setData({
      show: true,
      buyNow: 0
    })
  },

  // 立即购买
  handeGotoBuy() {
    this.setData({
      show: true,
      buyNow: 1
    })
  },
  //添加购物车和点击购买确认按钮的事件函数
  async addOrBuy(event) {
    console.log(event)


    if (!this.data.token) {
      wx.navigateTo({
        url: '/pages/login/login'
      })
      return
    }
    if (this.data.buyNow === 0) {
      const res = await reqAddCart({ goodsId: this.ID, count: this.data.count, blessing: this.data.blessing })
      if (res.code == 200) {
        this.setData({ show: false })
        this.getGoodList()
        toast({ title: '加入购物车成功' })
      } else {
        toast({ title: '加入购物车失败' })
      }
    } else {
      //跳转到立即购买界面
      const {goodsid,blessing} = event.currentTarget.dataset
      wx.navigateTo({
        url: `/modules/orderModule/pages/order/detail/detail?goodsId=${goodsid}&blessing=${blessing}`
      })
    }
  },
  async getGoodList() {
    if (!this.data.token) return
    const res = await reqGetCartList()
    console.log(res)
    var all = 0
    res.data.forEach((item) => {
      all = all + item.count
    })
    this.setData({
      allCount: all < 99 ? all : '99+'
    })
  },

  // 点击关闭弹框时触发的回调
  onClose() {
    this.setData({ show: false })
  },

  // 监听是否更改了购买数量
  onChangeGoodsCount(event) {
    console.log(event.detail)
    this.setData({
      count: Number(event.detail)
    })
  },
  onLoad(option) {
    console.log(option)
    this.ID = option.goodsId
    this.getGoodInfo()
    this.getGoodList()
  }
})
