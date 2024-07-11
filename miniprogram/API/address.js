import instance from '../utils/http'
/**
 * @description 新增收获地址
 * @param {*} data 收货人信息Object
 */
export const reqAddAddress = (data) => {
  return instance.post('/userAddress/save', data)
}
//获取收获地址
export const reqGetAddressList = () => {
  return instance.get('/userAddress/findUserAddress')
}
//收货地址详情
export const reqGetAddressInfo = (id) => {
  return instance.get(`/userAddress/${id}`)
}
//更新地址
export const reqUpdateAddress = (data) => {
  return instance.post('/userAddress/update',data)
}
//删除地址
export const reqDeleteAddress = (id) => {
  return instance.get(`/userAddress/delete/${id}`)
}



