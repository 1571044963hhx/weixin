import instance from '../utils/http'

/**
 * @description 用于获取商品的详细信息
 * @param {*} param0,page和limit是路径参数，需要连接在请求地址上面，data是请求参数，注意两者的区别,此外，由于一级分类和二级分类是可选参数，因此采用展开运算符进行调用
 */
export const reqGetGoodList = ({ page, limit, ...data }) => {
  return instance.get(`/goods/list/${page}/${limit}`, data)
}
/**
 * @description 获取单个商品的详细信息
 * @param {*} goodsId 商品的ID
 */
export const reqGetGoodInfo = (goodsId) => {
  return instance.get(`/goods/${goodsId}`)
}
