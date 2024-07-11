import instance from '../utils/http'

export const reqCayegoryData = () => instance.get('/index/findCategoryTree')
