import instance from '@/utils/http'
/**
 * @param {*} goodsId 商品的ID
 * @param {*} count 数量
 * @param {*} blessing(data) 祝福语
 */
export const reqAddCart = ({goodsId, count, ...data}) => {
  return instance.get(`/cart/addToCart/${goodsId}/${count}`, data)
}
//获取购物车列表
export const reqGetCartList = () => {
  return instance.get(`/cart/getCartList`)
}
//更新商品状态，0不勾选，1勾选
export const reqUpdateGood = (goodsId, isChecked) => {
  return instance.get(`/cart/checkCart/${goodsId}/${isChecked}`)
}
//全选和全不选，0取消全选，1全选
export const reqIschecked = (isChecked) => {
  return instance.get(`/cart/checkAllCart/${isChecked}`)
}
//删除商品
export const reqDeleteGood = (goodsId) => {
  return instance.get(`/cart/delete/${goodsId}`)
}
