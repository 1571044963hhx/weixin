import { reqOrderAddress, reqOrderInfo, reqOrderBuy, reqOrderSubmit, reqReadyPay } from '@/API/order'
import { toast, modal } from '@/utils/extendApi'
//必须要加上.js结尾
import { formatTime } from '@/utils/formatTime.js'
import Schema from 'async-validator'
const app = getApp()
Page({
  data: {
    buyName: '', // 订购人姓名
    buyPhone: '', // 订购人手机号
    deliveryDate: '', // 期望送达日期
    blessing: '', // 祝福语
    address: {},
    orderInfo: {},
    show: false, // 期望送达日期弹框
    minDate: new Date().getTime(),
    currentDate: new Date().getTime()
  },

  // 选择期望送达日期
  onShowDateTimerPopUp() {
    this.setData({
      show: true
    })
  },

  // 期望送达日期确定按钮
  onConfirmTimerPicker(event) {
    console.log(event)
    const deliveryDate = formatTime(new Date(event.detail))
    this.setData({
      show: false,
      deliveryDate
    })
  },
  //验证规则函数
  validatorPerson(params) {
    // 验证收货人，是否只包含大小写字母、数字和中文字符
    const nameRegExp = '^[a-zA-Z\\d\\u4e00-\\u9fa5]+$'
    // 验证手机号
    const phoneReg = '^1(?:3\\d|4[4-9]|5[0-35-9]|6[67]|7[0-8]|8\\d|9\\d)\\d{8}$'
    const rules = {
      buyName: [
        { required: true, message: '请输入订货人姓名' },
        { pattern: nameRegExp, message: '订货人姓名不合法' }
      ],
      buyPhone: [
        { required: true, message: '请输入订货人电话' },
        { pattern: phoneReg, message: '订货人电话不合法' }
      ],
      userAddressId: { required: true, message: '请选择收货地址' },
      deliveryDate: { required: true, message: '请选择收货时间' }
    }
    const newValiator = new Schema(rules)
    //返回一个promise对象
    return new Promise((resolve) => {
      newValiator.validate(params, (errors, fields) => {
        if (errors) {
          toast({
            title: errors[0].message
          })
          resolve({ valid: false })
        } else {
          resolve({ valid: true })
        }
      })
    })
  },
  async submitOrder() {
    const { buyName, buyPhone, deliveryDate, blessing, orderInfo, address } = this.data
    // 组织请求参数
    const params = {
      buyName,
      buyPhone,
      deliveryDate,
      remarks: blessing,
      cartList: orderInfo.cartVoList,
      userAddressId: address.id
    }
    // 对请求参数进项验证
    const { valid } = await this.validatorPerson(params)
    // 打印验证结果
    console.log(valid)
    //验证不成功阻止下面的代码运行
    if (!valid) return
    try {
      const res = await reqOrderSubmit(params)
      //获取订单编号
      if (res.code === 200) {
        this.orderNo = res.data
        this.getPayInfo()
      }
    } catch (error) {
      toast({ title: '支付失败' })
    }
  },
  //获取预支付信息
  async getPayInfo() {
    const res = await reqReadyPay(this.orderNo)
    if (res.code === 200) {
      // const payInfo = await wx.requestPayment(res.data)
      // console.log(payInfo)
      const promise = await modal({
        title: '支付成功',
        content: '由于此次开发没有wx.requestPayment接口权限，因此不能弹出支付窗口界面，点击确认将前往订单列表界面，取消则支付失败'
      })
      if(promise){
        wx.navigateTo({
          url: "/modules/orderModule/pages/order/list/list",
        })
      }else{
        return
      }
    }
  },

  // 期望送达日期取消按钮 以及 关闭弹框时触发
  onCancelTimePicker() {
    this.setData({
      show: false,
      minDate: new Date().getTime(),
      currentDate: new Date().getTime()
    })
  },

  // 跳转到收货地址
  toAddress() {
    wx.navigateTo({
      url: '/modules/settingModule/pages/address/list/index?flag=1'
    })
  },
  async getAddress() {
    console.log(app)
    if (app.globalDate?.address.id) {
      this.setData({
        address: app.globalData.address
      })
      return
    }
    const { data: address } = await reqOrderAddress()
    this.setData({
      address
    })
  },
  // 获取订单详情
  async getOrderInfo() {
    const { goodsId, blessing } = this.data
    const { data: orderInfo } = goodsId ? await reqOrderBuy({ goodsId, blessing }) : await reqOrderInfo()
    // 判断是否存在祝福语
    // 如果需要购买多个商品，挑选第一个填写了祝福语的商品进行赋值
    const orderGoods = orderInfo.cartVoList.find((item) => item.blessing !== '')
    this.setData({
      orderInfo,
      blessing: !orderGoods ? '' : orderGoods.blessing
    })
  },
  onShow() {
    this.getAddress()
    this.getOrderInfo()
  },
  onLoad(options) {
    this.setData({
      ...options
    })
  },

  onUnload() {
    app.globalData.address = {}
  }
})
