import { reqCayegoryData } from '../../API/category'
Page({
  data: {
    list: [],
    activeIndex: 0 //被激活的索引
  },
  updateActive(event) {
    console.log(event.currentTarget.dataset.index)
    this.setData({
      activeIndex: event.currentTarget.dataset.index
    })
  },
  async onLoad() {
    const res = await reqCayegoryData()
    if (res.code === 200) {
      this.setData({
        list: res.data
      })
    }
    console.log(res.data)
    console.log(this.list)
  }
})
