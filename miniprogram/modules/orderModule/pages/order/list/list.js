import {reqOrderList} from "@/API/order"
import { toast } from "@/utils/extendApi"

Page({
  // 页面的初始数据
  data: {
    orderList:[],
    page:1,  //页码
    limit:10,//每一页的数量
    total:0, //总条数
    isLoading:false
  },
  async getOrderList(){
    this.data.isLoading = true
    const res = await reqOrderList(this.data.page,this.data.limit)
    this.data.isLoading = false
    this.setData({
      orderList: [...this.data.orderList, ...res.data.records],
      total: res.data.total
    })
  },
  onReachBottom(){
    const {page,total,orderList,isLoading} = this.data
    if (isLoading) return
    if(total===orderList.length){
      return toast({title:"数据加载完毕"})
    }
    this.setData({
      page:page+1
    })
    this.getOrderList()
  },
  onLoad(){
    this.getOrderList()
  }
})
