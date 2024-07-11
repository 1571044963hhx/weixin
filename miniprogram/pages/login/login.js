// pages/login/login.js
import { reqlogin, requser } from '../../API/login'
import { setstorage } from '../../utils/storage'
import { toast } from '../../utils/extendApi'
import { ComponentWithStore } from 'mobx-miniprogram-bindings'
import { userStore } from '../../store/userstore'
import { debounce } from 'miniprogram-licia'
ComponentWithStore({
  //让页面和store对象建立关联
  storeBindings: {
    store: userStore,
    fields: ['token', 'userInfo'],
    actions: ['setToken', 'setUserInfo']
  },
  methods: {
    login: debounce(function () {
      wx.login({
        success: async (res) => {
          if (res.code) {
            const token = await reqlogin(res.code)
            setstorage('token', token.data.token)
            //将token存入store对象中，做成响应式数据
            this.setToken(token.data.token)
            //获取用户信息
            this.getuser()
            //返回上一级页面
            wx.navigateBack()
          } else {
            toast({
              title: '登录失败，请重新授权'
            })
          }
        }
      })
    }, 500),
    async getuser() {
      const userInfo = await requser()
      setstorage('userInfo', userInfo.data)
      this.setUserInfo(userInfo.data)
    }
  }
})
