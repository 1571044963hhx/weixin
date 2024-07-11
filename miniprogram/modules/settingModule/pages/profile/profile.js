import { userBehavior } from './behavior'
import { updateUserInfo } from '../../../../API/login'
Page({
  // 页面的初始数据
  data: {
    isShowPopup: false // 控制更新用户昵称的弹框显示与否
  },
  behaviors: [userBehavior],
  chooseAvatar(event) {
    const { avatarUrl } = event.detail
    wx.uploadFile({
      url: 'https://gmall-prod.atguigu.cn/mall-api/fileUpload',
      filePath: avatarUrl,
      name: 'file',
      header: {
        token: wx.getStorageSync('token')
      },
      success: (res) => {
        // 将获取到的头像赋值给 data 中变量同步给页面结构
        const uploadRes = JSON.parse(res.data)
        console.log(uploadRes)
        this.setData({
          'userInfo.headimgurl': uploadRes.data
        })
      },
      fail(err) {
        wx.showToast({
          title: '头像更新失败，请稍后再试',
          icon: 'none'
        })
      }
    })
    //注意解构的方式和键的设置方式，注意，此处可以直接设置仓库的值
  },
  getNewName(event) {
    const { nickname } = event.detail.value
    this.setData({
      'userInfo.nickname': nickname,
      isShowPopup: false
    })
  },
  // 更新用户信息
  async UserInfo() {
    // 调用 API，更新用户信息
    await updateUserInfo(this.data.userInfo)

    // 将用户信息存储到本地
    wx.setStorageSync('userInfo', this.data.userInfo)
    // 将用户信息存储到 Store
    // this.setUserInfo(this.data.userInfo)
    console.log(this.data.token, this)
    // 给用户提示头像更新成功
    wx.showToast({
      title: '头像更新成功',
      icon: 'none'
    })
  },

  // 显示修改昵称弹框
  onUpdateNickName() {
    this.setData({
      isShowPopup: true
    })
  },

  // 弹框取消按钮
  cancelForm() {
    this.setData({
      isShowPopup: false,
      'userInfo.nickname': this.data.userInfo.nickname
    })
  }
})
