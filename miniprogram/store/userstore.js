import { observable, action } from 'mobx-miniprogram'
import { getstorage } from '../utils/storage'

// 创建 store 对象，存储应用的状态,对象中的数据会被转化为action
export const userStore = observable({
  // 创建可观察状态 token
  token: getstorage('token') || '',
  userInfo: getstorage('userInfo') || {},
  // 对 token 进行修改
  setToken: action(function (token) {
    this.token = token
  }),
  setUserInfo: action(function (userInfo) {
    this.userInfo = userInfo
  })
})
