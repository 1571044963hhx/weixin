import instance from '@/utils/http'

//获取订单详情
export const reqOrderInfo = () => {
  return instance.get('/order/trade')
}

//获取订单地址
export const reqOrderAddress = () => {
  return instance.get('/userAddress/getOrderAddress')
}

/**
 * @description 立即购买API
 * @param {*} goodsId 商品的ID，data祝福语
 */
export const reqOrderBuy = ({ goodsId, ...data }) => {
  return instance.get(`/order/buy/${goodsId}`, data)
}
/**
 * @description 提交订单
 * @param {*} data 是一个对象{buyName，buyPhone，cartList...}
 */
export const reqOrderSubmit = (data) => {
  return instance.post('/order/submitOrder', data)
}

//微信预支付信息
export const reqReadyPay = (orderNo) => {
  return instance.get(`/webChat/createJsapi/${orderNo}`)
}

//微信支付状态查询
export const reqStatsSearch = (orderNo) => {
  return instance.get(`/webChat/queryPayStatus/${orderNo}`)
}


/**
 * @description 获取订单列表
 * @param {*} page 页码
 * @param {*} limit 每页的数量
 */
export const reqOrderList = (page,limit)=>{
  return instance.get(`/order/order/${page}/${limit}`)
}
