import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '@/store/userstore'
import { reqGetCartList, reqUpdateGood, reqIschecked, reqDeleteGood, reqAddCart } from '@/API/cart'
import { toast } from '@/utils/extendApi'
//引入滑块自动收起功能
import { swipeCellBehavior } from '@/behavior/swipeCellBahavior'
const computedBehavior = require('miniprogram-computed').behavior
//导入防抖功能模块
import { debounce } from 'miniprogram-licia'

ComponentWithStore({
  behaviors: [computedBehavior, swipeCellBehavior],
  // 组件的属性列表
  storeBindings: {
    store: userStore,
    fields: ['token']
  },

  // 组件的初始数据
  data: {
    cartList: [],
    emptyDes: '还没有添加商品，快去添加吧～'
  },
  //计算属性
  computed: {
    // 计算属性是以函数的写法表示，其中要想获取data里面的数据需要以形参来获取,且必须返回一个值，selectAllStatus=key，return=value
    selectAllStatus(data) {
      return data.cartList.length !== 0 && data.cartList.every((item) => item.isChecked == 1)
      //如果里面的每一项都返回1的话，则返回true
    },
    //计算订单总金额
    totalPrice(data) {
      let total = 0
      data.cartList.forEach((item) => {
        if (item.isChecked === 1) {
          total += item.count * item.price
        }
      })
      return total
    }
  },
  // 组件的方法列表
  methods: {
    //获取购物车信息列表
    async getGoodList() {
      if (!this.data.token) {
        this.setData({
          cartList: [],
          emptyDes: '还没有登录，请登录'
        })
        return
      }
      const res = await reqGetCartList()
      this.setData({
        cartList: res.data
      })
    },
    //更新物品选中状态
    async updateStaus(event) {
      // event.detail表示选中状态，event.dataset.id表示ID
      const isChecked = event.detail ? 1 : 0
      const res = await reqUpdateGood(event.target.dataset.id, isChecked)
      if (res.code === 200) {
        this.getGoodList()
      }
    },
    //全选或者取消全选
    async cancelChecked(event) {
      const { checked } = event.target.dataset
      const newChecked = checked ? 0 : 1
      const res = await reqIschecked(newChecked)
      if (res.code === 200) {
        this.getGoodList()
      }
    },
    //点击去结算页面
    toOrder() {
      if (this.data.totalPrice == 0) {
        toast({ title: '请选择购买的商品' })
        return
      }
      wx.navigateTo({
        url: '/modules/orderModule/pages/order/detail/detail'
      })
    },
    //更新商品的数量
    changeBuyNum: debounce(async function (event) {
      // 验证用户输入的值，是否是 1 ~ 200 直接的正整数
      // const reg = /^([1-9]|[1-9]\d|1\d{2}|200)$/
      const { id: goodsId, index, oldbuynum } = event.target.dataset
      const buynum = event.detail
      const count = buynum - oldbuynum
      // 如果购买数量没有发生改变，不发送请求
      if (count === 0) return
      // 发送请求：购买的数量 和 差值
      const res = await reqAddCart({ goodsId, count })
      // 服务器更新购买数量成功以后，更新本地的数据
      if (res.code === 200) {
        this.setData({
          [`cartList[${index}].count`]: buynum
        })
      }
    }, 500),

    // 删除商品

    // async changeBuy(event) {
    //   console.log(event)
    //   const { id: goodsId, index, oldbuynum } = event.target.dataset
    //   const buynum = event.detail
    //   const count = buynum - oldbuynum
    //   // 如果购买数量没有发生改变，不发送请求
    //   if (count === 0) return
    //   // 发送请求：购买的数量 和 差值
    //   const res = await reqAddCart({ goodsId, count })
    //   console.log(res)
    //   // 服务器更新购买数量成功以后，更新本地的数据
    //   if (res.code === 200) {
    //     this.setData({
    //       [`cartList[${index}].count`]: buynum
    //     })
    //   }
    // },
    // changeBuyNum(event) {
    //   let timer
    //   const that = this
    //   return (function () {
    //     clearTimeout(timer)
    //     timer = setTimeout(() => {
    //       that.changeBuy(event)
    //     }, 1000)
    //   })()
    // },
    async deleteGoods(event) {
      const { id } = event.target.dataset
      const res = await reqDeleteGood(id)
      if (res.code === 200) {
        this.getGoodList()
        toast({ title: '删除商品成功' })
      }
    },
    onShow() {
      this.getGoodList()
    },
    //页面隐藏时，滑块自动收起
    onHide() {
      this.onSwipeCellCommonClick()
    }
  }
})
