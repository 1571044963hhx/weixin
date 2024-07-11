import instance from '../utils/http'

export const reqIndexData = async () => {
  return instance.all(
    instance.get('/index/findBanner'),
    instance.get('/index/findCategory1'),
    instance.get('/index/advertisement'),
    instance.get('/index/findListGoods'),
    instance.get('/index/findRecommendGoods')
  )
}
