import instance from '../utils/http'
/**
 * @description 用于获取token
 * @param {*} code 表示临时登录凭证，wx.login()API响应的结果
 */
export const reqlogin = (code) => {
  return instance.get(`/weixin/wxLogin/${code}`)
}

export const requser = ()=>{
  return instance.get("/weixin/getuserInfo")
}
/**
 * @description 用于更新用户的头像和昵称
 * @param {*} userInfo 用户的头像和昵称
 */
export const updateUserInfo = (userInfo)=>{
  return instance.post("/weixin/updateUser",userInfo)
}
