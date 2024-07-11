import { reqGetAddressList, reqDeleteAddress } from '../../../../../API/address'
import { toast } from '../../../../../utils/extendApi'
import { swipeCellBehavior } from '../../../../../behavior/swipeCellBahavior'
//获取全局应用实例
const app = getApp()
Page({
  behaviors: [swipeCellBehavior],
  // 页面的初始数据
  data: {
    addressList: []
  },

  // 去编辑页面
  toEdit(event) {
    console.log(event)
    //在事件处理函数的组件旁边加上自定义属性data-id,当点击该组件时，可以通过event对象获取该属性值
    const { id } = event.currentTarget.dataset
    this.ID = id
    wx.navigateTo({
      url: `/modules/settingModule/pages/address/add/index?id=${id}`
    })
  },
  editAddress(event) {
    if (this.flag !== '1') return
    const addressId = event.currentTarget.dataset.id
    const address = this.data.addressList.find((item) => item.id === addressId)
    if (address) {
      app.globalData.address = address
      wx.navigateBack()
    }
  },
  async deleteInfo(event) {
    const { id } = event.currentTarget.dataset
    const res = await reqDeleteAddress(id)
    if (res.code == 200) {
      const res = await reqGetAddressList()
      this.setData({
        addressList: res.data
      })
    } else {
      toast({ title: '删除失败' })
    }
  },
  async onShow() {
    const res = await reqGetAddressList()
    this.setData({
      addressList: res.data
    })
  },
  onLoad(options) {
    console.log(options.flag)
    this.flag = options.flag
  }
})
